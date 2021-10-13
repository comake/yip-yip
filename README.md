# YipYip

![image](https://user-images.githubusercontent.com/13453719/136746212-e744bc0e-4830-4abf-9a47-59c21892d72a.png)

YipYip is an always-on search assitant that turns Gmail (and any other website) into a keyboard-first product.

Just type to search.

YipYip highlights any buttons or links in the page matching your search.

Press Tab to jump through the matches.

Press Enter to select the current match.

Voila!

Video Demo: https://www.youtube.com/watch?v=87tqknjluKU

## Installation

**Extension store listings**\
[Google Chrome Extension](https://chrome.google.com/webstore/detail/yipyip/flbkmacappdledphgdoolmenldginemg/)\
Edge Add-On (Coming Soon)\
Firefox Extension (Coming Soon)

**To Install from source**
1. Run these commands in your terminal
```
git clone https://github.com/comake/yip-yip.git
cd yip-yip
yarn build
```
2. go to [chrome://extensions](chrome://extensions) 
3. Turn on [Developer Mode](https://developer.chrome.com/docs/extensions/mv3/faq/#faq-dev-01) in the top right
4. Click "Load unpacked" in the top left of [chrome://extensions](chrome://extensions) and select the `build` folder within your local `yip-yip` folder, or just drag the `build` folder into the [chrome://extensions](chrome://extensions) page.
5. Every time you make a change to the code, run `yarn build` then refresh the extension in the browser.

# How it works

When a user types in the YipYip search bar on a webpage, YipYip recursively scans through the webpage's DOM node tree to find all nodes which match the users query. Whether a node matches the query or not is determined by detecting if any text within the node includes the user's query or if an attribute of the node includes the user's query. 

Not all attributes a node may have are relevant for our purposes, thus, YipYip only searches a specific list of attributes per node based on it's tag name. These can be found in [hidden_attributes_by_node_name.json](https://github.com/comake/yip-yip/blob/main/src/data/hidden_attributes_by_node_name.json)

In addition to matching nodes against the user's exact query, we also match against synonyms of the user's query. This helps in the case that a user describes their intention in a slightly different way than the webpage does (trash vs. delete vs. discard), especially for buttons which only display an icon and no text. We explored the idea of using a precompiled synonym library or a word similarity algorithm (like [word2vec](https://en.wikipedia.org/wiki/Word2vec)) but decided against such a "generalized" solution because the meaning of a link or button on a webpage is extremely context dependent. Instead, YipYip has a configuration file per URL host with synonyms specific to that host. Each configuration file can be thought of as mapping to an "App" used in the browser (eg. mail.google.com for Gmail, news.ycombinator.com for Hacker News).

After finding all nodes matching the user's query, we filter those nodes down to only those which we want to add selection around and allow the user to select. Serveral factors determine what gets selected:
1. If the node's tag name specifies that it's a button, link, or input
2. If the node's `role` attributte specifies that it's a button, link, or input
3. If the node matches an additional selector defined in that App's configuration file, under the `additional_button_selectors` config

We now score each of the matched buttons, links, and inputs which will be selected. These scores are used to determine which is the "best" matching node that will be selected first. Of course the "best" matching node is highly contextual based on several factors. A nodes score is increased if:
- the match was made through text on the screen vs. a hidden attribute of the node, 
- the match was made through the user's exact query vs. a synonym,
- the match is on the screen vs. not,
- any words in the match's fields start with the user's query vs. just including the query,
- any words in the match's fields are in the user's query and are in a list of "relevant words" in the App's configuration,
- the node matches one of the selectors in the list of "relevant selectors" in the App's configuration.

Each of these factors has a related weight which determines how much it effects the node's score.

Once the matching buttons, links, and inputs are found and sorted according to score, we add a selection box around each node and focus and scroll to the one with the highest score. A user can then press the `tab` key to jump through the matches, then press  the `enter` key to click or focus the selected button, link, or input.

# TODOs
- [ ] Testing with Jest
- [ ] Allow score weights to be changed per App config?


