rm -rf ../dist && \
node update-precompiled-files.js && \
format=cjs vite build && \
format=umd vite build && \
format=es vite build && \
node generate-volar-types.js