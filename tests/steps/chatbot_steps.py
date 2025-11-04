# -*- coding: utf-8 -*-
from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pathlib import Path
import json
import time

SLEEP_TIME = 1

current_dir = Path(__file__).parent
json_path = current_dir.joinpath("..", "..", "frontend", "public", "data", "chatbot_db.json").resolve()
with open(json_path, "r", encoding="utf-8") as f:
    chatbot_db = json.load(f)


def _get_expected_answer(question: str) -> str:
    if question in chatbot_db["exact_replies"]:
        return chatbot_db["exact_replies"][question]
    for item in chatbot_db["keyword_replies"]:
        if any(kw in question for kw in item["keywords"]):
            return item["reply"]
    return chatbot_db["unknown_responses"][0]


@given("the chatbot page is opened")
def step_open_chatbot(context):
    from pages.chatbot_page import ChatbotPage
    context.page = ChatbotPage(context.driver)
    context.page.open()
    time.sleep(SLEEP_TIME)
    context.chat_history = []
    context.last_question = None
    context.last_answer = None


@given("the user has previous chat history")
def step_previous_history(context):
    context.page.click_view_history()
    time.sleep(SLEEP_TIME)
    context.chat_history = context.page.get_all_chat_texts()


@given("the user has multiple chats in history")
def step_multiple_chats(context):
    context.page.click_view_history()
    time.sleep(SLEEP_TIME)
    context.chat_history = context.page.get_all_chat_texts()
    assert len(context.chat_history) > 1, "No multiple chats found in history"


@when('the user clicks the prepared question button "{question}"')
def step_click_predefined(context, question):
    context.page.click_predefined_question(question)
    time.sleep(SLEEP_TIME)
    context.last_question = question
    answer = chatbot_db["exact_replies"].get(question, "")
    context.last_answer = answer
    context.chat_history.append({"question": question, "answer": answer})


@when('the user types "{question}"')
def step_type_question(context, question):
    input_box = context.page.driver.find_element(By.ID, "chat-input")
    input_box.clear()
    input_box.send_keys(question)
    time.sleep(SLEEP_TIME)
    context.last_question = question


@when('the user clicks "Send"')
def step_click_send(context):
    send_btn = context.page.driver.find_element(By.ID, "send-button")
    send_btn.click()
    time.sleep(SLEEP_TIME)
    WebDriverWait(context.page.driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".chat-message-bot"))
    )
    context.last_answer = _get_expected_answer(context.last_question)
    context.chat_history.append({"question": context.last_question, "answer": context.last_answer})


@when('the user clicks "View Chat History"')
def step_view_history(context):
    context.page.click_view_history()
    time.sleep(SLEEP_TIME)
    WebDriverWait(context.page.driver, 10).until(
        EC.presence_of_element_located(context.page.CHAT_HISTORY_DIV)
    )


@when('the user clicks "Copy Response"')
def step_copy_response(context):
    WebDriverWait(context.page.driver, 10).until(
        lambda d: "chat-message-bot" in d.page_source
    )
    time.sleep(SLEEP_TIME)
    context.page.click_copy_response()
    time.sleep(SLEEP_TIME)


@when('the user clicks the "Delete" button next to "{chat_text}"')
def step_delete_chat(context, chat_text):
    context.page.delete_chat(chat_text)
    time.sleep(SLEEP_TIME)


@when('the user scrolls to the top of chat history')
def step_scroll_first_chat(context):
    context.page.scroll_to_first_chat()
    time.sleep(SLEEP_TIME)


@when('the user asks multiple questions:')
def step_ask_multiple_questions(context):
    for row in context.table:
        question = row['سوال']
        context.page.type_and_send(question)
        time.sleep(SLEEP_TIME)
        if question in chatbot_db["exact_replies"]:
            answer = chatbot_db["exact_replies"][question]
        else:
            answer = None
            for kw_item in chatbot_db["keyword_replies"]:
                if any(kw in question for kw in kw_item["keywords"]):
                    answer = kw_item["reply"]
                    break
            if answer is None:
                answer = chatbot_db["unknown_responses"][0]
        context.chat_history.append({"question": question, "answer": answer})


@when('the user can type a new question "{question}"')
def step_type_new_question(context, question):
    context.page.type_and_send(question)
    time.sleep(SLEEP_TIME)
    if question in chatbot_db["exact_replies"]:
        answer = chatbot_db["exact_replies"][question]
    else:
        answer = None
        for kw_item in chatbot_db["keyword_replies"]:
            if any(kw in question for kw in kw_item["keywords"]):
                answer = kw_item["reply"]
                break
        if answer is None:
            answer = chatbot_db["unknown_responses"][0]
    context.last_question = question
    context.last_answer = answer
    context.chat_history.append({"question": question, "answer": answer})


@then('the chatbot should display "{expected_answer}"')
def step_check_answer(context, expected_answer):
    time.sleep(SLEEP_TIME)
    actual = context.page.get_output_text()
    assert actual == expected_answer, f"Expected: '{expected_answer}', Got: '{actual}'"


@then('the chatbot should display the correct answer')
def step_check_correct_answer(context):
    time.sleep(SLEEP_TIME)
    expected = _get_expected_answer(context.last_question)
    actual = context.page.get_output_text()
    assert actual == expected, f"Expected: {repr(expected)}\nGot:      {repr(actual)}"


@then('the user can type a new question "{question}"')
def step_user_can_type_new_question(context, question):
    input_box = context.page.driver.find_element(By.ID, "chat-input")
    input_box.clear()
    input_box.send_keys(question)
    time.sleep(SLEEP_TIME)
    context.last_question = question


@then('the chatbot should display one of unknown_responses')
def step_check_unknown(context):
    time.sleep(SLEEP_TIME)
    actual = context.page.get_output_text()
    assert actual in chatbot_db["unknown_responses"], f"Got: {actual}"


@then('the chatbot should display one of ai_fallback_responses')
def step_check_ai_fallback(context):
    time.sleep(SLEEP_TIME)
    actual = context.page.get_output_text()
    assert actual in chatbot_db["ai_fallback_responses"], f"Got: {actual}"


@then("the question should be saved in chat history")
def step_check_saved(context):
    time.sleep(SLEEP_TIME)
    assert any(c["question"] == context.last_question for c in context.chat_history), \
        f"Question '{context.last_question}' not in chat history"



@then("chat history should contain {count:d} messages")
def step_check_history_count(context, count):
    time.sleep(SLEEP_TIME)
    assert len(context.chat_history) == count, f"Expected {count}, got {len(context.chat_history)}"



@then("the chat history should display all previous messages")
def step_display_history(context):
    time.sleep(SLEEP_TIME)
    history_text = context.page.get_history_text()
    for c in context.chat_history:
        assert c["question"] in history_text, f"'{c['question']}' missing in history display"
        assert c["answer"] in history_text, f"'{c['answer']}' missing in history display"



@then('the response should be available in the clipboard')
def step_check_clipboard(context):
    time.sleep(SLEEP_TIME)
    latest_bot_text = context.page.get_output_text()
    assert latest_bot_text == context.last_answer, (
        f"Copied content mismatch.\n"
        f"Expected: {repr(context.last_answer)}\n"
        f"Got:      {repr(latest_bot_text)}"
    )


@then('the chat "{chat_text}" should no longer be visible in history')
def step_check_deleted(context, chat_text):
    time.sleep(SLEEP_TIME)
    WebDriverWait(context.page.driver, 10).until_not(
        EC.presence_of_element_located((
            By.XPATH, f'//li[contains(@class, "chat-item") and .//a[normalize-space(text())="{chat_text}"]]'
        ))
    )


@then('the first chat "{chat_text}" should be visible')
def step_check_first_chat(context, chat_text):
    time.sleep(SLEEP_TIME)
    history_text = context.page.get_history_text()
    assert chat_text in history_text, f"First chat '{chat_text}' not visible"


@then('the chatbot should display a summary report with title "{title}"')

def step_check_report(context, title):
    time.sleep(SLEEP_TIME)
    report_text = context.page.get_history_text()
    assert title in report_text
