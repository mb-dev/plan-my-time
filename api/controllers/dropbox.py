from flask                import jsonify, request, g
from app                  import app

@app.route('/api/dropbox/hook', methods= ['GET'])
def webhook():
  return request.args.get('challenge')
