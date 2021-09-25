#!/bin/bash

# setup
tmux_session_bot=discordbot

# get applicatio dir and switch to it
application_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $application_dir

start() {
    echo "Start bot..."
	tmux new-session -d -s $tmux_session_bot \; send-keys "cd $application_dir ;npm run start" Enter
}
stop() {
    echo "Stop bot..."
	tmux kill-session -t $tmux_session_bot
}
restart() {
    stop
    sleep 5
    start
}

# check command
case $1 in 
    "--start" )
        start
        ;;
    "--stop" )
        stop
        ;;
    "--restart" )
        restart
        ;;
    *)
        echo "Error: Your input was incorrect."
        exit 1
        ;;
esac