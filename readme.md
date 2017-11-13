Slóð á síðuna: https://lokaverkefni16.herokuapp.com/

Finna þarf möppuna þar sem skránnar fyrir vefsíðuna eru staðsettar í cmd glugga.
Svo skal skrifa npm install.

Til að keyra vefsíðuna skal skrifa npm start. Þá sést síðan á localhost:3000.

Hægt er að kanna eslint villur með npm run -s lint.
Eins má gera fyrir stylelint villur með npm run -s csslint.

Til að redis virki þarf að setja upp redis af https://redis.io/download,
og keyra svo redis server með því að opna nýan cmd glugga
og skrifa redis-server.

Hugsanlegt er að ef redis-server virkar ekki í fyrstu þurfi að finna möppuna
þar sem redis er installað og keyra redis-cli.exe og skrifa þar shutdown.
Eftir það má reyna að skrifa redis-server í nýan cmd glugga.
