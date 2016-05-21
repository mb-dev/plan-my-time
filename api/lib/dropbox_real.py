import dropbox
from dropbox.oauth import DropboxOAuth2Flow, BadRequestException, BadStateException, CsrfException, NotApprovedException, ProviderException
from dropbox.client import DropboxClient
from dropbox.files import WriteMode, GetMetadataError, DownloadError, LookupError
from dropbox.exceptions import ApiError
import lib.errors
import lib.date_helpers as date_helpers

def convert_metadata(metadata):
  return {"name": metadata.name, "path_lower": metadata.path_lower, "last_modified": date_helpers.to_datetime_str(metadata.server_modified), "rev": metadata.rev}

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
      if type(e.error) is DownloadError and e.error.is_path() and e.error.get_path().is_not_found():
        pass
      else:
        raise
    metadata = dbx.files_upload("", path, WriteMode('overwrite'))
    return {"content": "", **convert_metadata(metadata)}

  def update_file(self, access_token, path, text):
    dbx = dropbox.Dropbox(access_token)
    metadata = dbx.files_upload(text, path, WriteMode('overwrite'))
    return convert_metadata(metadata)

# {
#     "entries": [
#         {
#             ".tag": "file",
#             "name": "Prime_Numbers.txt",
#             "path_lower": "/homework/math/prime_numbers.txt",
#             "path_display": "/Homework/math/Prime_Numbers.txt",
#             "id": "id:a4ayc_80_OEAAAAAAAAAXw",
#             "client_modified": "2015-05-12T15:50:38Z",
#             "server_modified": "2015-05-12T15:50:38Z",
#             "rev": "a1c10ce0dd78",
#             "size": 7212,
#             "sharing_info": {
#                 "read_only": true,
#                 "parent_shared_folder_id": "84528192421",
#                 "modified_by": "dbid:AAH4f99T0taONIb-OurWxbNQ6ywGRopQngc"
#             }
#         },
#         {
#             ".tag": "folder",
#             "name": "math",
#             "path_lower": "/homework/math",
#             "path_display": "/Homework/math",
#             "id": "id:a4ayc_80_OEAAAAAAAAAXz",
#             "sharing_info": {
#                 "read_only": false,
#                 "parent_shared_folder_id": "84528192421"
#             }
#         }
#     ],
#     "cursor": "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu",
#     "has_more": false
# }

  # returns: array of metadata
  def get_files_in_folder(self, folder, access_token, cursor = None):
    files = []
    dbx = dropbox.Dropbox(access_token)
    has_more = True
    while has_more:
      if cursor is None:
        result = dbx.files_list_folder(folder)
      else:
        result = dbx.files_list_folder_continue(cursor)
      files += [convert_metadata(metadata) for metadata in result.entries]
      cursor = result.cursor
      has_more = result.has_more
    return files, cursor
