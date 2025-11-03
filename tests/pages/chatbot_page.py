# -*- coding: utf-8 -*-
from selenium.webdriver.common.by import By

class ChatbotPage:
    URL = "http://localhost:5173"

    # Locators
    CHAT_INPUT = (By.ID, "chat-input")
    SEND_BUTTON = (By.ID, "send-button")
    # this should be class not id because there are multiple response and id should be uniqe
    CHAT_OUTPUT = (By.CSS_SELECTOR, ".chat-output:last-of-type")

    VIEW_HISTORY_BTN = (By.CSS_SELECTOR, "header a[href='/all-chats']")
    CHAT_HISTORY_DIV = (By.CLASS_NAME, "main-all-chats")


    PREDEFINED_BUTTONS = (By.CLASS_NAME, "predefined-questions button")

    def __init__(self, driver):
        self.driver = driver

    def open(self):
        self.driver.get(self.URL)

    def click_predefined_question(self, question):
        button_id = self.PREDEFINED_BUTTONS.get(question)
        if not button_id:
            raise ValueError(f"No button ID mapped for question: {question}")
        self.driver.find_element(By.ID, button_id).click()

    def click_follow_up_by_text(self, text):
        buttons = self.driver.find_elements(By.CLASS_NAME, "follow-up")
        for btn in buttons:
            if btn.text.strip() == text:
                btn.click()
                return
        raise Exception(f"Follow-up button '{text}' not found.")

    def type_and_send(self, question):
        input_box = self.driver.find_element(*self.CHAT_INPUT)
        input_box.clear()
        input_box.send_keys(question)
        self.driver.find_element(*self.SEND_BUTTON).click()

    def click_view_history(self):
        self.driver.find_element(*self.VIEW_HISTORY_BTN).click()

    # def click_generate_report(self):
    #     self.driver.find_element(*self.GENERATE_REPORT_BTN).click()

    def get_output_text(self):
        return self.driver.find_element(*self.CHAT_OUTPUT).text.strip()

    #  TODO: should we implement this ? 
    # def get_mode_text(self):
    #     return self.driver.find_element(*self.CHAT_MODE).text.strip()

    def get_history_text(self):
        return self.driver.find_element(*self.CHAT_HISTORY_DIV).text.strip()