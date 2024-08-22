const ce = customElements;

import captcha from "./modules/formElements/captcha.js";
import editor from "./modules/formElements/editor.js";
import email from "./modules/formElements/email.js";
import message from "./modules/formElements/message.js";
import select from "./modules/formElements/select.js";
import tel from "./modules/formElements/tel.js";
import text from "./modules/formElements/text.js";

ce.define("e-captcha", captcha);
ce.define("frfs-editor", editor);
ce.define("frfs-email", email);
ce.define("frfs-message", message);
ce.define("frfs-select", select);
ce.define("frfs-tel", tel);
ce.define("frfs-text", text);

// new popup();

// profilecontainer
