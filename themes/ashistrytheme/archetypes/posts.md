+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
tags = ''
outputs = ['html','rss']
+++
