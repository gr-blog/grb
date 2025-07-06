#!/bin/sh
set -eux
VERSION="1.2.3"
tmp_dir="/tmp/install_oras"
rm -rf $tmp_dir
mkdir -p $tmp_dir
cd $tmp_dir
curl -LO "https://github.com/oras-project/oras/releases/download/v${VERSION}/oras_${VERSION}_linux_amd64.tar.gz"
mkdir -p oras-install/
tar -zxf oras_${VERSION}_*.tar.gz -C oras-install/
mv oras-install/oras /bin/ || true
