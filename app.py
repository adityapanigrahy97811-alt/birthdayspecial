import streamlit as st
import streamlit.components.v1 as components
import base64
import os

# Set page configuration to make it wide and clean
st.set_page_config(
    page_title="Happy Birthday Bestie 💖",
    page_icon="💖",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to hide Streamlit elements and make the iframe fullscreen
hide_st_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
            .stApp {
                overflow: hidden;
            }
            .block-container {
                padding-top: 0rem;
                padding-bottom: 0rem;
                padding-left: 0rem;
                padding-right: 0rem;
            }
            iframe {
                width: 100vw;
                height: 100vh;
                border: none;
                display: block;
            }
            </style>
            """
st.markdown(hide_st_style, unsafe_allow_html=True)

# Helper function to convert images to Base64 data URLs
def get_image_base64(path):
    if os.path.exists(path):
        with open(path, "rb") as image_file:
            return "data:image/png;base64," + base64.b64encode(image_file.read()).decode()
    return ""

# Get the path to files
dir_path = os.path.dirname(os.path.realpath(__file__))
html_path = os.path.join(dir_path, "index.html")
css_path = os.path.join(dir_path, "styles.css")
js_path = os.path.join(dir_path, "script.js")

if os.path.exists(html_path) and os.path.exists(css_path) and os.path.exists(js_path):
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
        
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    # Inject CSS directly into the HTML template
    html_content = html_content.replace(
        '<link rel="stylesheet" href="styles.css" />',
        f'<style>{css_content}</style>'
    )
    
    # Inject JS directly into the HTML template
    html_content = html_content.replace(
        '<script src="script.js"></script>',
        f'<script>{js_content}</script>'
    )

    # Convert local asset images to Base64 so they render within the iframe
    for i in range(1, 4):
        img_path = os.path.join(dir_path, "assets", f"photo{i}.png")
        img_base64 = get_image_base64(img_path)
        if img_base64:
            html_content = html_content.replace(f'src="assets/photo{i}.png"', f'src="{img_base64}"')

    # Render the combined self-contained HTML in a full-viewport component
    components.html(html_content, height=1000, scrolling=True)
else:
    st.error("Required birthday files (index.html, styles.css, or script.js) are missing.")
