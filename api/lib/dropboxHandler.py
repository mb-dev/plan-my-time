from dropbox import DropboxOAuth2Flow
import errors

class DropboxHandler(object):
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
  def dropbox_auth_finish(self, web_app_session):
    try:
      access_token, user_id, url_state = \
              self.__get_dropbox_auth_flow(web_app_session).finish(
                  request.query_params)
    except BadRequestException as e:
      raise errors.AppException(errors.DROPBOX_BAD_REQUEST)
    except BadStateException as e:
      raise errors.AppException(errors.DROPBOX_INVALID_STATE)
    except CsrfException as e:
      raise errors.AppException(errors.DROPBOX_CSRF_ERROR)
    except NotApprovedException as e:
      raise errors.AppException(errors.DROPBOX_NOT_APPROVED)
    except ProviderException as e:
      raise errors.AppException(errors.DROPBOX_PROVIDER_EXCEPTION)
