import React from 'react';

const useUrlChangeSubscription = () => {
  const [host, setHost] = React.useState(window.location.host);

  React.useEffect(() => {
    const pushState = window.history.pushState;
    const replaceState = window.history.replaceState;

    window.history.pushState = function () {
      pushState.apply(window.history, arguments);
      setHost(window.location.host)
    };

    window.history.replaceState = function () {
      replaceState.apply(window.history, arguments);
      setHost(window.location.host)
    };

    window.addEventListener('popstate', () => setHost(window.location.host));
  }, [])

  return { host }
}

export default useUrlChangeSubscription;
