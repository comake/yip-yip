/*global history*/
import React from 'react';

const useUrlChangeSubscription = () => {
  const [host, setHost] = React.useState(window.location.host);
  const updateHost = React.useCallback(() => {
    console.debug('updating host')
    setHost(window.location.host)
  })

  React.useEffect(() => {
    const pushState = window.history.pushState;
    const replaceState = window.history.replaceState;

    window.history.pushState = function () {
      pushState.apply(window.history, arguments);
      updateHost()
    };

    window.history.replaceState = function () {
      replaceState.apply(window.history, arguments);
      updateHost()
    };

    window.addEventListener('popstate', () => updateHost());
  }, [])

  return { host }
}

export default useUrlChangeSubscription;
