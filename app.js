const $downloadBtn = $(`<button class="ui labeled icon red button" id="download"><i class="cloud icon"></i>Download</button>`);
const Emoji = (emojiID, animated = false) => `https://cdn.discordapp.com/emojis/${emojiID}.${animated ? "gif" : "png"}?v=1`;
const API = {
    host: "https://cors-anywhere.herokuapp.com/https://discordapp.com/api/v6",
    emojis: (guild) => `/guilds/${guild}/emojis`,
    guilds: "/users/@me/guilds",
    guild: (id) => `/guilds/${id}`,
    request: (method, endpoint, token) => {
        return fetch(API.host + endpoint, {
            method,
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": token
            }
        });
    }
}
const sortAlpha = (a, b) => {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0
}

$(document).ready(() => {
    $(".menu .item").tab();
    $("#emojis").hide();

    $("#default-1 #continue").click(async function(e) {
        e.preventDefault(e);

        let success;
        const token = $("#token").val();
        $("#continue").addClass("loading");

        if (!token) return

        success = true

        const res = await API.request("GET", API.guilds, token);
        if (await res.status !== 200) return error(res.status === 401 ? "Invalid token." : "Could not authenticate with Discord.");

        let guilds = await res.json();
        guilds = guilds.sort(sortAlpha);

        const guildsDropdown = guilds.map(guild => {
            return {
                name: guild.icon
                    ? `<img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png" />${guild.name}`
                    : guild.name,
                value: guild.id
            }
        });

        this.guild = []
        this.emojis = []
        $("#server-select").dropdown({
            values: guildsDropdown,
            placeholder: "Select Server",
            onChange: async (value, text, $selected) => {
                $("#default-2").append(`<div class="ui active dimmer"><div class="ui loader"></div></div>`);
                const res = await API.request("GET", API.guild(value), token);
                if(await res.status !== 200) return error("Could not fetch server emojis.");

                guild = await res.json();
                this.guild = [guild];
                this.emojis = guild.emojis;
                this.emojis = renameEmoji(this.emojis);
                this.emojis = this.emojis.sort(sortAlpha);
                emojis = this.emojis;

                let emojisDropdown = [];
                for (const emoji in emojis) {
                    emojisDropdown.push({
                        name: `<img src="${Emoji(emojis[emoji].id, emojis[emoji].animated)}" style="width: 1.5em!important; height: 1.5em!important;" /> ${emojis[emoji].name}`,
                        value: emojis[emoji].id,
                        selected: true
                    });
                }

                $("#emoji-select").dropdown({
                    values: emojisDropdown,
                    placeholder: "Select Emojis",
                    onChange: (value, text, $selected) => {
                        $("#emojicount").text(`(${$("input[name='emojis']").val().split(",").length}/${emojis.length})`);
                    }
                })

                $("#emojis").show();
                $(".active.dimmer").remove();
            }
        });

        $("#default-1").attr("data-tab", "default-hide");
        $("#default-2").attr("data-tab", "default");
        $.tab("change tab", "default");
    });

    $("#default-2 #submit").click(async (e) => {
        e.preventDefault(e);

        if (!this.emojis.length) return error("Please select at least one emoji.");
        try {
            if (this.guild.emojis.length < 1) return error("This server doesn't have any emojis!");
            const cleanGuildName = this.guild.name.replace(/\s/g, "_").replace(/\W/g, "");
            console.log("Emojis:", this.emojis.length);

            show("#loading");

            const renamedEmoji = renameEmoji(this.emojis);
            const zip = new JSZip();
            let count = 0;
            for (let i in renamedEmoji) {
                let req = await fetch(`https://cors-anywhere.herokuapp.com/${Emoji(renamedEmoji[i].id, renamedEmoji[i].animated)}`, {
                    method: "get",
                    mode: "cors",
                    headers: {
                        "Origin": `${window.location.protocol}//${window.location.host}`
                    }
                });
                zip.file(`${renamedEmoji[i].name}.${renamedEmoji[i].animated ? "gif" : "png"}`, req.arrayBuffer());
                count++;
            }

            $("#success-msg strong").text(count);
            show("#success");
            $("#default-2 #submit").after($downloadBtn);

            $("#download").click(() => {
                zip.generateAsync({ type: "blob" }).then(content => {
                    saveAs(content, `Emojis_${cleanGuildName}.zip`);
                });
            })
        } catch(err) {
            return error(err);
        }
    });

    $("#manual #submit").click(async (e) => {
        e.preventDefault(e);

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
                let req = await fetch(`https://cors-anywhere.herokuapp.com/${Emoji(renamedEmoji[i].id, renamedEmoji[i].animated)}`, {
                    method: "get",
                    mode: "cors",
                    headers: {
                        "Origin": `${window.location.protocol}//${window.location.host}`
                    }
                });
                zip.file(`${renamedEmoji[i].name}.png`, req.arrayBuffer());
                count++;
            }

            $("#success-msg strong").text(count);
            show("#success");
            $("#manual #submit").after($downloadBtn);

            $("#download").click(() => {
                zip.generateAsync({ type: "blob" }).then(content => {
                    saveAs(content, `Emojis_${cleanGuildName}.zip`);
                });
            })
        } catch(err) {
            return error("Recheck your code, it threw some syntax errors.");
        }
    });


    $("button#continue").click(() => {
        $("#error").hide();
    });

    function show(id) {
        $("#messages div.message").hide();
        $(id).fadeIn("slow").css("display", "inline-flex");
    }

    function error(message) {
        console.error(message);
        $("button").removeClass("loading");
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