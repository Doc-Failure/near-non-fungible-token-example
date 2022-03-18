#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for required environment variables"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$USER_ACCOUNT" ] && echo "Missing \$USER_ACCOUNT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"
[ -z "$USER_ACCOUNT" ] || echo "Found it! \$USER_ACCOUNT is set to [ $USER_ACCOUNT ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Delete $CONTRACT, setting $USER_ACCOUNT as beneficiary"
echo ---------------------------------------------------------
echo
near delete $CONTRACT $USER_ACCOUNT

echo
echo ---------------------------------------------------------
echo "Step 2: Clean up project folders"
echo ---------------------------------------------------------
echo
yarn clean

exit 0
