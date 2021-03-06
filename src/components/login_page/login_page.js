import React from 'react';
import { YIPYIP_FAQS_LINK, YIPYIP_WELCOME_LINK, EMAIL_REGEX, ENTER_KEYCODE,
  COMAKE_TERMS_LINK, COMAKE_PRIVACY_POLICY_LINK } from '../../constants.js';
import { ReactComponent as Logo } from '../../icons/logo-with-color.svg';
import useDocumentEvent from "../../hooks/use_document_event.js";
import useStoredSettings from "../../hooks/use_stored_settings.js";
import WebRequest from '../../lib/web_request.js';
import LoadingSpinner from './loading_spinner.js';

const LoginPage = (props) => {
  const { userEmail, updateUserEmail } = useStoredSettings();
  const inputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState(userEmail);
  const [prevStoredUserEmail, setPrevStoredUserEmail] = React.useState(null);
  const hasValidEmail = React.useMemo(() => EMAIL_REGEX.test(email), [email]);
  const [errors, setErrors] = React.useState(null);

  const updateEmail = React.useCallback(event => {
    setEmail(event.target.value)
    setErrors(null);
  }, []);

  const submitEmail = React.useCallback(() => {
    setLoading(true)

    WebRequest.verifyLoginEmail({ email: email, product: 'yipyip' })
      .then(
        (respData) => {
          updateUserEmail(email)
          window.location.href = YIPYIP_WELCOME_LINK;
        },
        (errors) => {
          setLoading(false)
          setErrors(errors);
        }
      );
  }, [email, updateUserEmail])

  const handleKeydown = React.useCallback(event => {
    if (event.code === ENTER_KEYCODE && hasValidEmail && !loading) {
      submitEmail()
    }
  }, [hasValidEmail, submitEmail, loading])

  useDocumentEvent('keydown', hasValidEmail, handleKeydown)

  React.useEffect(() => {
    if (userEmail != prevStoredUserEmail) {
      setPrevStoredUserEmail(userEmail)

      if (userEmail) {
        setEmail(userEmail)
        window.location.href = YIPYIP_WELCOME_LINK;
      }
    }

  }, [userEmail, prevStoredUserEmail])

  React.useEffect(() => {
    inputRef.current.focus()
  }, [])

  React.useEffect(() => {
    setLoading(true)

    WebRequest.getMe({ product: 'yipyip' })
      .then(respData => {
        if (respData.user) {
          updateUserEmail(respData.user.email)
          window.location.href = YIPYIP_WELCOME_LINK;
        } else {
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div id='yipyip-login-page-container'>
      <div id='yipyip-login-page-width'>
        <div id='yipyip-login-page-logo'><Logo /></div>
        <div id='yipyip-login-page-header'>Welcome to YipYip!</div>
        <div id='yipyip-login-page-description'>Please enter your email to continue:</div>
        <input
          ref={inputRef}
          name={'yipyip-email'}
          placeholder={'Email'}
          type={'text'}
          value={email}
          onChange={updateEmail}
          id={'yipyip-login-page-input'}
          class={loading ? 'yipyip-login-page-input-disabled' : ''}
        />

        <div id={'yipyip-login-page-enter-to-continue-line'}>
          { errors && (
              <div id='yipyip-login-page-errors'>
                { Object.values(errors).map(fieldErrors => fieldErrors[0]).join(', ') }
              </div>
            )
          }
          { !errors && (
              <button
                id={'yipyip-login-page-enter-to-continue'}
                class={!hasValidEmail || loading ? 'yipyip-hidden-button' : ''}
                onClick={submitEmail}
              >
                Press Enter to continue
              </button>
            )
          }
          { loading && <LoadingSpinner /> }
        </div>

        <div id={'yipyip-login-page-terms'}>
          <p>
            Your email will not be sold or given to any third party. It will only be used to help you get started and update you on improvements relating to YipYip and Comake.
          </p>
          <p>
            <a href={YIPYIP_FAQS_LINK} target={'_blank'} rel="noreferrer" class={'yipyip-blue-link'}>As explained on our webpage</a>, YipYip tracks who has our extension installed and how often it is used. We will never track or store your queries or browsing history.
          </p>
          <p>
            By continuing you are agreeing to Comake's greater <a href={COMAKE_TERMS_LINK} target={'_blank'} rel="noreferrer">terms</a> and <a href={COMAKE_PRIVACY_POLICY_LINK} target={'_blank'} rel="noreferrer">privacy policy.</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
