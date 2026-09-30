#!/bin/bash
# This script calculates simple interest given principal, annual rate of interest and time period in years.
# Do not use this in production. Sample purpose only.

# Author: Upkar Lidder (IBM)
# Addtional Authors:
#

# Input:
# principal, principal amount
# rate, annual rate of interest
# time, time period in years

printf "Enter principal: "
read -r principal
printf "Enter rate of interest: "
read -r rate
printf "Enter time period: "
read -r time

simple_interest=$((principal * rate * time / 100))
printf "The simple interest is: %s\n" "$simple_interest"
