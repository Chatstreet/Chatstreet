from flask import Flask

app: Flask = Flask(__name__)


@app.get('/')
def main() -> str:
    return 'Chat-Street Backend'


@app.get('/health')
def health() -> str:
    return 'ok'


if __name__ == '__main__':
    app.run()
