#!/usr/bin/env bash

set -e

plugin_dir="${HOME}/Library/Application Support/Insomnia/plugins/gitlab-sync"

rm -fr "${plugin_dir}";

mkdir -p "${plugin_dir}";

cp package.json "${plugin_dir}/package.json";

cp -R node_modules/ "${plugin_dir}/node_modules";

cp -R built "${plugin_dir}/built";

echo "The plugin has been installed."

