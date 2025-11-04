# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

def before_all(context):
    
    context.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    context.wait = WebDriverWait(context.driver, 10)

def after_all(context):
    context.driver.quit()