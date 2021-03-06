export const F_KEYCODE = 'KeyF';
export const ENTER_KEYCODE = 'Enter';
export const TAB_KEY = 'Tab';
export const BACKSPACE_KEY = 'Backspace';
export const ESCAPE_KEYCODE = 'Escape';

export const MAC_OS_PLATFORMS = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];

export const KEYS_VALID_FOR_FOCUS_REGEX = /^[a-zA-Z0-9-_/]$/i;
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const YIPYIP_ROOT_ID = 'yipyip-root';
export const YIPYIP_INPUT_ID = 'yipyip-input';
export const YIPYIP_HIGHLIGHT_CLASS = 'yipyip-highlight';
export const YIPYIP_FOLLOWING_HIGHLIGHT_CLASS = 'yipyip-following-highlight';
export const KNOWLEDGE_OS_ROOT_ID = 'chromake-dock';

export const DISCORD_INVITE_LINK = 'https://discord.gg/CnaC38Ch2p';
export const COMAKE_LANDING_PAGE_LINK = 'https://comake.io';
export const GITHUB_REPO_LINK = 'https://github.com/comake/yip-yip';
export const TWITTER_LINK = "https://twitter.com/intent/tweet?text=So%20amazing%20to%20fly%20through%20the%20web%20with%20%40YipYipSearch,%20my%20always-on%20search%20assistant!%20Never%20have%20to%20take%20my%20fingers%20of%20the%20keyboard%F0%9F%94%A5%F0%9F%92%A8";
export const YIPYIP_FAQS_LINK = 'https://www.yip-yip.com/#FAQs';
export const YIPYIP_WELCOME_LINK = 'https://www.yip-yip.com/welcome';
export const TYPEFORM_FEEDBACK_LINK = 'https://comake1.typeform.com/to/auw8nYZg';
export const COMAKE_TERMS_LINK = 'https://www.comake.io/terms';
export const COMAKE_PRIVACY_POLICY_LINK = 'https://www.comake.io/privacy';

export const YIPYIP_CONTAINER_HEIGHT = 50;
export const YIPYIP_CONTAINER_WIDTH = 300;
export const YIPYIP_CONTAINER_DEFAULT_EDGE_MARGIN = 10;

export const INPUT_NODE_TYPES = ['INPUT', 'TEXTAREA', 'SELECT'];
export const LINK_OR_BUTTON_OR_INPUT_TYPES = ['BUTTON', 'A', 'LINK', 'INPUT', 'TEXTAREA', 'SELECT'];
export const LINK_OR_BUTTON_ROLE_VALUES = ['link', 'button', 'checkbox', 'tab'];
export const DO_NOT_SEARCH_NODE_TYPES = ['SCRIPT', 'STYLE'];

export const FIELD_BOOSTS = {
  innerText: 1,
  attribute: 0.9
}

export const SEARCH_TERM_BOOSTS = {
  searchText: 1,
  synonym: 0.9
}

export const IS_VISIBLE_BOOST = 1.1;
export const STARTS_WITH_BOOST = 1.5;
export const RELEVANT_WORD_BOOST = 1.5;
export const RELEVANT_SELECTOR_BOOST = 1.6;

export const SETTINGS_KEYS = {
  AUTO_HIDE: 'autoHide',
  USE_ON_EVERY_WEBSITE: 'useOnEveryWebsite',
  USER_EMAIL: 'userEmail',
  ALWAYS_ON: 'alwaysOn'
};
