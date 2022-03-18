#!/usr/bin/env bash

#
set -e


echo "Please export $USER_ACCOUNT before to use this script"
echo "export USER_ACCOUNT=<your_near_account_name>"
echo
echo
echo ---------------------------------------------------------
echo "Step 0: Set the varable isProduction to false"
echo
echo ---------------------------------------------------------
echo
echo

near call $CONTRACT ft_initialize --account-id $USER_ACCOUNT

echo
exit 0