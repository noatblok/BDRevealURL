/**
 * 
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Library 
 * @returns 
 */
module.exports = (Plugin, Library) => {

    const {DiscordSelectors, WebpackModules, DOMTools, Logger, Patcher, Utilities} = Library;
    return class extends Plugin {

        onStart() {
            Logger.info("itz alive now");
            Utilities.suppressErrors(this.patchMessageContent.bind(this), "message content patch")();
        }

        onStop() {
            Logger.info("itz gone..");
            Patcher.unpatchAll();
        }
        patchMessageContent() {
            const MessageContent = WebpackModules.getModule(m => m?.type?.toString().includes("messageContent"));
            Patcher.after(MessageContent, "type", (_, [props], returnValue) => {
                var msgs = document.querySelectorAll(`[id*='message-content']`)
                msgs.forEach((msg) => {
                    if(msg != null && msg.querySelector(`[class*='anchor-']`) && msg.querySelector(`[id='urlval']`) == null){
                        var urlselector = `[class*='anchorUnderlineOnHover-']`
                        var msgurlvals = msg.querySelectorAll(urlselector)
                        msgurlvals.forEach((found) => {
                            if(found.title != found.href){
                                var urlval = `<span id='urlval'>     (${found.href})</span>`
                                DOMTools.insertAfter(DOMTools.parseHTML(urlval), msg.children[0])
                                Logger.debug(msg)
                            }
                        })
                    }
                })
            });
        }
    };

};