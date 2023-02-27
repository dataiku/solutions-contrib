rm -rf ../dist && \
format=cjs vite build && \
format=umd vite build && \
format=es vite build && \
node generate-volar-types.js