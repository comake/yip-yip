VERSION=$(node -p -e "require('./package.json').version")
cd build
zip -r ../dist/yipyip-v${VERSION}.zip *
cd ../firefox_build
zip -r ../dist/yipyip-firefox-v${VERSION}.zip *
