require("core-js/stable");
require("regenerator-runtime/runtime");
const _fetch = require("node-fetch");
const JSZip = require("jszip");
const { saveAs } = require("file-saver");
const $ = require("./jquery-3.2.1.min.js");
window.jQuery = $;

const downloadBtn = $(`<button class="ui labeled icon red button" id="download" type="button"><i class="cloud icon"></i>Download</button>`);
const Emoji = (emojiID, animated = false) => `https://cdn.discordapp.com/emojis/${emojiID}.${animated ? "gif" : "png"}?v=1`;
const API = {
    host: "https://discord.com/api/v6",
    emojis: (guild) => `/guilds/${guild}/emojis`,
    guilds: "/users/@me/guilds",
    guild: (id) => `/guilds/${id}`,
    request: async (method, endpoint, token) => {
        return await _fetch(API.host + endpoint, {
            method,
            headers: {
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

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/json");
editor.session.setUseWrapMode(true);
editor.setValue(`{
    "mfa_level": 0,
    "emojis": [
        {
            "require_colons": true,
            "animated": false,
            "managed": false,
            "name": "really1",
            "roles": [],
            "id": "326074073702727682"
        },
        {
            "require_colons": true,
            "animated": false,
            "managed": false,
            "name": "really4",
            "roles": [],
            "id": "326074073832620033"
        }
    ],
    "application_id": null,
    "name": "big emotes",
    "roles": [
        {
            "hoist": false,
            "name": "@everyone",
            "mentionable": false,
            "color": 0,
            "position": 0,
            "id": "326073960041152512",
            "managed": false,
            "permissions": 104324161
        }
    ],
    "afk_timeout": 300,
    "system_channel_id": null,
    "widget_channel_id": null,
    "region": "eu-west",
    "default_message_notifications": 0,
    "embed_channel_id": null,
    "explicit_content_filter": 0,
    "splash": null,
    "features": [],
    "afk_channel_id": null,
    "widget_enabled": false,
    "verification_level": 0,
    "owner_id": "152164749868662784",
    "embed_enabled": false,
    "id": "326073960041152512",
    "icon": null
}`);
editor.clearSelection();

$(document).ready(function() {
    $(".menu .item").tab();
    $("#emojis").hide();
    $("#emojis2").hide();

    $("#tokenHelp").click(() => {
        $('.ui.basic.modal').modal('show');
    });

    globalThis.guild = [];
    globalThis.emojis = [];
    $("#default-1 #continue").click(async (e) => {
        e.preventDefault(e);

        let success;
        let token = $("#token").val();
        $("#continue").addClass("loading");

        if (!token) return;
        token = token.replace(/^"(.+)"$/, "$1");

        success = true

        let res = await API.request("GET", API.guilds, token);
        if (!res.ok) return error(res.status === 401 ? "Invalid token." : "Could not authenticate with Discord.");

        const guildsDropdown = (await res.json()).sort(sortAlpha).map(guild => {
            return {
                name: guild.icon
                    ? `<img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png" />${guild.name}`
                    : guild.name,
                value: guild.id
            }
        });

        $("#server-select").dropdown({
            values: guildsDropdown,
            placeholder: "Select Server",
            onChange: async (value, text, $selected) => {
                $("#default-2").append(`<div class="ui active dimmer"><div class="ui loader"></div></div>`);
                $("#error").hide();
                $("#messages div.message").hide();
                $("#download").remove();

                let res = await API.request("GET", API.guild(value), token);
                if (!res.ok) return error("Could not fetch server emojis.");

                globalThis.guild = await res.json();
                globalThis.emojis = renameEmoji(globalThis.guild.emojis)
                    .sort(sortAlpha);
                let emojis = globalThis.emojis.reduce((acc, val, i) => {
                    if (i > 149) {
                        acc[1].push(val);
                    } else {
                        acc[0].push(val);
                    }
                    return acc;
                }, [[], []]);

                let emojisDropdown = [];
                for (const emoji of emojis[0]) {
                    emojisDropdown.push({
                        name: `<img src="${Emoji(emoji.id, emoji.animated)}" style="width: 1.5em!important; height: 1.5em!important;" /> ${emoji.name}`,
                        value: emoji.id,
                        selected: true
                    });
                }

                $("#emoji-select").dropdown({
                    values: emojisDropdown,
                    placeholder: "Select Emojis",
                    onChange: (value, text, $selected) => {
                        $("#emojicount").text(`(${$("input[name='emojis']").val().split(",").length}/${emojis[0].length})`);
                    }
                })

                let emojisDropdown2 = [];
                for (const emoji of emojis[1]) {
                    emojisDropdown2.push({
                        name: `<img src="${Emoji(emoji.id, emoji.animated)}" style="width: 1.5em!important; height: 1.5em!important;" /> ${emoji.name}`,
                        value: emoji.id,
                        selected: true
                    });
                }

                $("#emoji-select2").dropdown({
                    values: emojisDropdown2,
                    placeholder: "Select Emojis",
                    onChange: (value, text, $selected) => {
                        $("#emojicount2").text(`(${$("input[name='emojis2']").val().split(",").length}/${emojis[1].length})`);
                    }
                })

                $("#emojis").show();
                if (emojisDropdown2.length > 0)
                    $("#emojis2").show();
                $(".active.dimmer").remove();
            }
        });

        $("#default-1").attr("data-tab", "default-hide");
        $("#default-2").attr("data-tab", "default");
        $.tab("change tab", "default");
    });

    $("#default-2 #submit").click(async (e) => {
        e.preventDefault(e);

        if (!globalThis.emojis.length) return error("Please select at least one emoji.");
        try {
            if (globalThis.guild.emojis.length < 1) return error("This server doesn't have any emojis!");
            const cleanGuildName = globalThis.guild.name.replace(/\s/g, "_").replace(/\W/g, "");
            console.log("Emojis:", globalThis.emojis.length);

            show("#loading");

            const renamedEmoji = renameEmoji(globalThis.emojis);
            const zip = new JSZip();
            let count = 0;
            for (let i in renamedEmoji) {
                let res
                try {
                    res = await _fetch(Emoji(renamedEmoji[i].id, renamedEmoji[i].animated)).then(res => res.blob());
                } catch {
                    console.log(`Emoji ${renamedEmoji[i].id} blocked by CORS, trying proxy`);
                    res = await _fetch(`https://cors-anywhere.herokuapp.com/${Emoji(renamedEmoji[i].id, renamedEmoji[i].animated)}`).then(res => res.blob());
                }
                zip.file(`${renamedEmoji[i].name}.${renamedEmoji[i].animated ? "gif" : "png"}`, res);
                count++;
            }

            $("#success-msg strong").text(count);
            show("#success");
            $("#default-2 #submit").after(downloadBtn);

            downloadBtn.click(() => {
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
                const res = await _fetch(Emoji(renamedEmoji[i].id, renamedEmoji[i].animated)).then(res => res.blob());
                zip.file(`${renamedEmoji[i].name}.${renamedEmoji[i].animated ? "gif" : "png"}`, res);
                count++;
            }

            $("#success-msg strong").text(count);
            show("#success");
            $("#manual #submit").after(downloadBtn);

            $("#download").click(() => {
                zip.generateAsync({ type: "blob" }).then(content => {
                    saveAs(content, `Emojis_${cleanGuildName}.zip`);
                });
            })
        } catch(err) {
            return error("Recheck your code, it threw some syntax errors.", err);
        }
    });


    $("button#continue").click(() => {
        $("#error").hide();
    });

    function show(id) {
        $("#messages div.message").hide();
        $(id).fadeIn("slow").css("display", "inline-flex");
    }

    function error(message, ...args) {
        console.error(message, ...args);
        $("button").removeClass("loading");
        $("#error-msg").text(message);
        show("#error");
    }

    function renameEmoji(emojis) {
        if (!emojis) return console.error("No Emojis Array");
        const emojiCountByName = {};
        const disambiguatedEmoji = [];
        const customEmojis = {};
        const emojisByName = {};
        const emojisById = {};

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

            emojisByName[emoji.name] = emoji;
            if (emoji.id) {
                emojisById[emoji.id] = emoji;
                customEmojis[emoji.name] = emoji;
            }
            disambiguatedEmoji.push(emoji);
        };

        emojis.forEach(disambiguateEmoji);
        return disambiguatedEmoji;
    }
});
