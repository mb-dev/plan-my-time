import dropbox
from dropbox.oauth import DropboxOAuth2Flow, BadRequestException, BadStateException, CsrfException, NotApprovedException, ProviderException
from dropbox.client import DropboxClient
from dropbox.files import WriteMode, GetMetadataError
from dropbox.exceptions import ApiError
import lib.errors

def convert_metadata(metadata):
  return {"name": metadata.name, "last_modified": metadata.server_modified, "rev": metadata.rev}

class DropboxApi(object):
  # session[csrf_token_session_key] will be stored
  def __get_dropbox_auth_flow(self, config, session):
    return DropboxOAuth2Flow(
      config['DROPBOX_APP_KEY'],
      config['DROPBOX_APP_SECRET'],
      config['DROPBOX_REDIRECT'],
      session,
      "dropbox-auth-csrf-token")

  # URL handler for /dropbox-auth-start
  def dropbox_auth_start(self, config, web_app_session):
    dropboxFlow = self.__get_dropbox_auth_flow(config, web_app_session)
    authorize_url = dropboxFlow.start()
    return authorize_url

  # URL handler for /dropbox-auth-finish
  def dropbox_auth_finish(self, config, session, query):
    try:
      access_token, user_id, url_state = \
              self.__get_dropbox_auth_flow(config, session).finish(query)
      return access_token, user_id, url_state
    except BadRequestException as e:
      raise errors.AppException(errors.DROPBOX_BAD_REQUEST)
    except BadStateException as e:
      raise errors.AppException(errors.DROPBOX_INVALID_STATE)
    except CsrfException as e:
      print(e)
      raise errors.AppException(errors.DROPBOX_CSRF_ERROR)
    except NotApprovedException as e:
      raise errors.AppException(errors.DROPBOX_NOT_APPROVED)
    except ProviderException as e:
      raise errors.AppException(errors.DROPBOX_PROVIDER_EXCEPTION)

  def get_user_info(self, access_token):
    client = DropboxClient(access_token)
    info = client.account_info()
    return {
      "email": info["email"],
      "verified": info["email_verified"],
      "first_name": info["name_details"]["given_name"],
      "last_name": info["name_details"]["surname"],
      "country": info["country"]
    }

  # files
  def get_file_content(self, access_token, path):
    dbx = dropbox.Dropbox(access_token)
    metadata, response = dbx.files_download(path)
    return {"content": response.content.decode('utf-8'), **convert_metadata(metadata)}

  def get_file_or_create(self, access_token, path):
    dbx = dropbox.Dropbox(access_token)
    try:
      return self.get_file_content(access_token, path)
    except ApiError as e:
      print(e)
      if type(e.error) is GetMetadataError:
        pass
      else:
        raise
    metadata = dbx.files_upload("", path, WriteMode('overwrite'))
    return {"content": "", **convert_metadata(metadata)}

  def update_file(self, access_token, path, text):
    dbx = dropbox.Dropbox(access_token)
    metadata = dbx.files_upload(text, path, WriteMode('overwrite'))
    return convert_metadata(metadata)

  # returns: array of metadata
  def get_files_in_folder(self, access_token):
    files = []
    dbx = dropbox.Dropbox(access_token)
    cursor = None
    has_more = True
    while has_more:
      result = dbx.files_list_folder('', cursor)
      files += [convert_metadata(metadata) for metadata in result.entries]
      cursor = result.cursor
      has_more = result.has_more
    return files
