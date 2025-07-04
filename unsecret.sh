#!/bin/bash
placeholders=("2zQ1evQBPCFxerSaReVVXNNQLYa"
    "2zQ1ev17yIoL9PSm7ZGahmc5F2"
    "2zQ1eu8e8tiwJRk2uDTEcME8SFf"
    "2zQ1ewzWzwirCSSqAerBiacams5"
)
for placeholder in "${placeholders[@]}"; do
    gh api -X \
        POST /repos/gregros-writes/grb/secret-scanning/push-protection-bypasses \
        -f reason=false_positive \
        -f placeholder_id="$placeholder"
done
