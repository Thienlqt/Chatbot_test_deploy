# Chatbot_test_deploy
This is a demo app for a bigger project that simply fetches the data of a set of FAQs from the database and finds the best match answer for it. Thanks for reading!


To set up:
1. Download React components and dependencies by entering this in the terminal:                                **npx create-react-app chatbot-ui**
2. Wait for React to be installed for a while.
3. After it is installed, create a folder name component inside the "src" folder either manually or by entering this in the terminal:                        **mkdir src/components**
4. After that, create a file name "chatbot.jsx" or whatever you want inside the "src" folder and copy the code in the file "Chatbot.jsx" I uploaded in my repository, then paste it to your empty "chatbot.jsx"

To run the app:
1. Create a new terminal and paste:                     **uvicorn main:app --host 127.0.0.1 --port 9090**                  or                **uvicorn main:app --host 127.0.0.1 --port 9090 --reload**
2. Then, create a new terminal and paste:                                                               **cd "your_chatbot_ui_file_path"**
3. And in the same terminal, paste:                      **npm install** (skip if you already install it).
4. And then paste:                        **npm start**
