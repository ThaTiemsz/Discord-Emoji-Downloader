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
			console.log("Emojis:", guild.emojis.length);

			show("#loading");

			const renamedEmoji = renameEmoji(guild.emojis);
			const zip = new JSZip();
			let count = 0;
			for (let i in renamedEmoji) {
				let req = await fetch("https://cors-anywhere.herokuapp.com/" + Emoji(renamedEmoji[i].id), { method: "get", mode: "cors"	});
				zip.file(`${renamedEmoji[i].name}.png`, req.arrayBuffer());
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

	function renameEmoji(emojis) {
		if (!emojis) return console.error("No Emojis Array");
		const emojiCountByName = {};
		this.disambiguatedEmoji = [];
		this.customEmojis = {};
		this.emojisByName = {};
		this.emojisById = {};

		const disambiguateEmoji = emoji => {
			const originalName = emoji.name;
			const existingCount = emojiCountByName[originalName] || 0;
			emojiCountByName[originalName] = existingCount + 1;
			if (existingCount > 0) {
				const name = `${originalName}~${existingCount}`;
				emoji = {
					...emoji,
					name,
					originalName
				};
			}

			this.emojisByName[emoji.name] = emoji;
			if (emoji.id) {
				this.emojisById[emoji.id] = emoji;
				this.customEmojis[emoji.name] = emoji;
			}
			this.disambiguatedEmoji.push(emoji);
		};

		emojis.forEach(disambiguateEmoji);
		return disambiguatedEmoji;
	}
});