#!/bin/bash
echo 'PDcorrupter/cron.sh';
date;
git checkout wip;
git add --all .;
if git commit -m 'Cron.sh auto commit.' ; then
	git push origin wip;
else
	git pull origin wip;
fi
