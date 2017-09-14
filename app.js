const Emoji = emojiID => `https://cdn.discordapp.com/emojis/${emojiID}.png`;
const $downloadBtn = $(`<button class="ui labeled icon red button" id="download"><i class="cloud icon"></i>Download</button>`);

$(document).ready(() => {
	$("#submit").click(async () => {
		const code = editor.getSession().getValue();
		if (!code) return error("You should probably get some code in there.");
		try {
			const guild = JSON.parse(code);
			if (!guild.id) return error("Your code seems off... are you sure you pasted the guild object?");
			if (!guild.emojis) return error("I couldn't find the emojis object.");
			if (guild.emojis.length < 1) return error("This server doesn't have any emojis!");
			const cleanGuildName = guild.name.replace(/\s/g, "_").replace(/\W/g, "");
			console.log(guild.emojis.length);

			show("#loading");

			const zip = new JSZip();
			let count = 0;
			for (i in guild.emojis) {
				let req = await fetch("https://cors-anywhere.herokuapp.com/" + Emoji(guild.emojis[i].id), { method: "get", mode: "cors"	});
				zip.file(`${guild.emojis[i].name}.png`, req.arrayBuffer());
				count++;
			}

			$("#success-msg strong").text(count);
			show("#success");
			$("#submit").after($downloadBtn);

			$("#download").click(() => {
				zip.generateAsync({type:"blob"}).then(content => {
					saveAs(content, `Emojis_${cleanGuildName}.zip`);
				});
			})
		} catch(err) {
			return error("Recheck your code, it threw some syntax errors.");
		}
	});

	const show = (id) => {
		$("#messages div.message").hide();
		$(id).fadeIn("slow").css("display", "inline-flex");
	}

	const error = (message) => {
		$("#error-msg").text(message);
		show("#error");
	}
});