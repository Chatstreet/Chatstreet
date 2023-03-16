from . import blueprint


@blueprint.route('/hello')
def hello():
    return 'Hello, World!'
