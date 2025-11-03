Feature: Test Persian Support Chatbot

  Scenario: User selects a prepared question about adding a new customer
    Given the chatbot page is opened
    When the user clicks the prepared question button "How can I add a new customer?"
    Then the chatbot should display "To add a new customer, go to the Customers menu and click 'Add'."

  Scenario: User asks an unknown question
    Given the chatbot page is opened
    When the user types "This is a test question with no answer"
    And the user clicks "Send"
    Then the chatbot should display one of unknown_responses

  Scenario: Checking chat history
    Given the chatbot page is opened
    When the user clicks the prepared question button "How can I create a new invoice?"
    And the user clicks "View Chat History"
    Then chat history should contain 1 messages
    And the chat history should display all previous messages
