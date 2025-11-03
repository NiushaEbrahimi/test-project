# -*- coding: utf-8 -*-
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from behave import given, when, then
from selenium.webdriver.common.by import By
from pathlib import Path
import time
import json

# Load responses once
current_dir = Path(__file__).parent
json_path = current_dir.joinpath("..", "..", "frontend", "public", "data", "chatbot_db.json").resolve()

with open(json_path, "r", encoding="utf-8") as f:
    chatbot_db = json.load(f)

@given("the chatbot page is opened")
def step_open_chatbot(context):
    from pages.chatbot_page import ChatbotPage
    context.page = ChatbotPage(context.driver)
    context.page.open()
    context.chat_history = []
    context.last_question = None

@when('the user clicks the prepared question button "{question}"')
def step_click_predefined(context, question):
    context.page.click_predefined_question(question)
    time.sleep(1)  # Replace with explicit wait if possible
    context.last_question = question
    context.chat_history.append(question)

@when('the user clicks the follow-up question "{question}"')
def step_click_followup(context, question):
    context.page.click_follow_up_by_text(question)
    time.sleep(1)
    context.last_question = question
    context.chat_history.append(question)

@when('the user types "{question}"')
def step_type_question(context, question):
    input_box = context.driver.find_element(By.ID, "chat-input")
    input_box.clear()
    input_box.send_keys(question)
    context.last_question = question

@when('the user clicks "Send"')
def step_click_send(context):
    context.page.driver.find_element(By.ID, "send-button").click()
    time.sleep(1)
    context.chat_history.append(context.last_question)

@when('the user clicks "View Chat History"')
def step_view_history(context):
    context.page.click_view_history()
    WebDriverWait(context.driver, 5).until(
        EC.presence_of_element_located(context.page.CHAT_HISTORY_DIV)
    )

@when('the user clicks "Generate Chat Report"')
def step_generate_report(context):
    context.page.click_generate_report()
    time.sleep(1)

@when('the user asks multiple questions:')
def step_ask_multiple_questions(context):
    for row in context.table:
        question = row['سوال']
        context.page.type_and_send(question)
        time.sleep(1)
        context.chat_history.append(question)

# --- Then steps ---
@then('the chatbot should display "{expected_answer}"')
def step_check_output(context, expected_answer):
    actual = context.page.get_output_text()
    assert actual == expected_answer, f"Expected: '{expected_answer}', Got: '{actual}'"

#  TODO: should we implement this ? 
# @then('the chatbot mode should be "{mode}"')
# def step_check_mode(context, mode):
#     actual = context.page.get_mode_text()
#     assert actual == mode, f"Expected mode: '{mode}', Got: '{actual}'"

@then("the question should be saved in chat history")
def step_check_saved(context):
    assert context.last_question in context.chat_history

@then("chat history should contain {count:d} messages")
def step_check_history_count(context, count):
    assert len(context.chat_history) == count

@then("the chat history should display all previous messages")
def step_display_history(context):
    history_text = context.page.get_history_text()
    for q in context.chat_history:
        assert q in history_text, f"'{q}' missing in history display"

@then('the chatbot should display a summary report with title "{title}"')
def step_check_report_title(context, title):
    report_text = context.page.get_history_text()
    assert title in report_text

@then('the chatbot should display one of ai_fallback_responses')
def step_check_ai_fallback(context):
    actual = context.page.get_output_text()
    assert actual in chatbot_db["ai_fallback_responses"], f"Got: {actual}"

@then('the chatbot should display one of unknown_responses')
def step_check_unknown(context):
    actual = context.page.get_output_text()
    assert actual in chatbot_db["unknown_responses"], f"Got: {actual}"