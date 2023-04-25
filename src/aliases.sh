alias gcm='function __gcm() { git add . && git commit -m "$*"; unset -f __gcm; }; __gcm'
alias commit='function __commit() { git add . && git commit -m "$*"; unset -f __commit; }; __commit'
alias pull='git pull'
alias push='git push'
alias gp='git push'
alias status='git status'
alias gs='git status'

echo "Aliases loaded for the terminal session. To remove, close the terminal or start a new session."
echo "Options:"
echo "    gcm (commit message) - git add . && git commit -m \"[input]\" (no quotes)" 
echo "        Example: gcm first commit"