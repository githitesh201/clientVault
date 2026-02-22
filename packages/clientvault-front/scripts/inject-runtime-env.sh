#!/bin/sh

echo "Injecting runtime environment variables into index.html..."

CONFIG_BLOCK=$(cat << EOF
    <script id="clientvault-env-config">
      window._env_ = {
        REACT_APP_SERVER_BASE_URL: "$REACT_APP_SERVER_BASE_URL"
      };
    </script>
    <!-- END: ClientVault Config -->
EOF
)
# Use sed to replace the config block in index.html
# Using pattern space to match across multiple lines
echo "$CONFIG_BLOCK" | sed -i.bak '
  /<!-- BEGIN: ClientVault Config -->/,/<!-- END: ClientVault Config -->/{
    /<!-- BEGIN: ClientVault Config -->/!{
      /<!-- END: ClientVault Config -->/!d
    }
    /<!-- BEGIN: ClientVault Config -->/r /dev/stdin
    /<!-- END: ClientVault Config -->/d
  }
' build/index.html
rm -f build/index.html.bak
