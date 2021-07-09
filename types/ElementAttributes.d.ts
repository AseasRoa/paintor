import { Combo } from './common'

type CommonAttributes = {
  /** @see https://www.w3schools.com/tags/att_script_crossorigin.asp */
  crossorigin? : Combo<'anonymous'|'use-credentials'>,

  /** @see https://www.w3schools.com/tags/att_button_formenctype.asp */
  enctype? : Combo<'application/x-www-form-urlencoded'|'multipart/form-data'|'text/plain'>,

  /** @see https://www.w3schools.com/tags/att_button_formmethod.asp */
  method? : Combo<'get'|'post'>,

  /** @see https://www.w3schools.com/tags/att_img_loading.asp */
  loading? : Combo<'eager'|'lazy'>,

  /** @see https://www.w3schools.com/tags/att_button_formtarget.asp */
  formtarget? : Combo<'_blank'|'_parent'|'_self'|'_top'|string>,

  /** @see https://www.w3schools.com/tags/att_audio_preload.asp */
  preload? : Combo<'auto'|'metadata'|'none'>,

  /** @see https://www.w3schools.com/tags/att_a_referrepolicy.asp */
  referrerpolicy? : Combo<'no-referrer'|'no-referrer-when-downgrade'|'origin'|'origin-when-cross-origin'
  |'same-origin' |'strict-origin-when-cross-origin'|'unsafe-url'>,

  /** @see https://www.w3schools.com/tags/att_a_target.asp */
  target? : Combo<'_blank'|'_parent'|'_self'|'_top'|string>,

  /** @see https://www.w3schools.com/tags/att_a_rel.asp */
  rel? : Combo<'alternate'|'author'|'bookmark'|'external'|'help'|'license'|'next'
  |'nofollow'|'noopener'|'noreferrer'|'prev'|'search'|''|'tag'>,

  /** @see https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types */
  imageMimeTypes? : Combo<string|'image/apng'|'image/avif'|'image/gif'|'image/jpeg'|'image/png'
  |'image/svg+xml'|'image/webp'|'image/bmp'|'image/x-icon'|'image/tiff'>,
}

/**
 * @see https://www.w3schools.com/tags/ref_standardattributes.asp
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
 * @see https://www.tutorialrepublic.com/html-reference/html5-global-attributes.php
 * */
export type GlobalElementAttributes = {
  /**
   * Keyboard shortcut to activate or add focus to the element.
   * @see https://www.w3schools.com/tags/att_global_accesskey.asp
   */
  accesskey? : Combo<string>,

  /**
   * Sets whether input is automatically capitalized when entered by user.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize
   */
  autocapitalize? : Combo<'on'|'off'|'none'|'words'|'characters'|'sentences'>,

  /**
   * Often used with CSS to style elements with common properties.
   * @see https://www.w3schools.com/html/html_classes.asp
   */
  class? : Combo<string>,

  /**
   * Indicates whether the element's content is editable.
   * @see https://www.w3schools.com/tags/att_global_contenteditable.asp
   */
  contenteditable? : Combo<boolean>,

  /**
   * Defines the ID of a <menu> element which will serve as the element's context menu.
   * @see https://www.w3schools.com/tags/att_global_contextmenu.asp
   */
  contextmenu? : Combo<string>,

  // data-*? : Combo<string>, //Lets you attach custom attributes to an HTML element.

  /**
   * Defines the text direction. Allowed values are ltr (Left-To-Right) or rtl (Right-To-Left).
   * @see https://www.w3schools.com/tags/att_global_dir.asp
   */
  dir? : Combo<'ltr'|'rtl'|'auto'>,

  /**
   * Defines whether the element can be dragged.
   * @see https://www.w3schools.com/tags/att_global_draggable.asp
   */
  draggable? : Combo<boolean|'true'|'false'|'auto'>,

  /**
   * Specifies whether the dragged data is copied, moved, or linked, when dropped.
   * @see https://www.w3schools.com/tags/att_dropzone.asp
    */
  dropzone? : Combo<'copy'|'move'|'link'>,

  /**
   * Prevents rendering of given element, while keeping child elements,
   * e.g. script elements, active.
   * @see https://www.w3schools.com/tags/att_hidden.asp
   */
  hidden? : Combo<''|'hidden'>,

  /**
   * Often used with CSS to style a specific element. The value of this attribute must be unique.
   * @see https://www.w3schools.com/html/html_id.asp
   */
  id? : Combo<string>,

  /**
   * Used to add properties to an item.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop
   */
  itemprop? : Combo<string>,

  /**
   * Defines the language used in the element.
   * @see https://www.w3schools.com/tags/att_global_lang.asp
   */
  lang? : Combo<string>,

  /**
   * Assigns a slot in a shadow DOM shadow tree to an element.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/slot
   */
  slot? : Combo<string>,

  /**
   * Indicates whether spell checking is allowed for the element.
   * @see https://www.w3schools.com/tags/att_global_spellcheck.asp
    */
  spellcheck? : Combo<boolean>,

  /**
   * Defines CSS styles which will override styles previously set.
   * @see https://www.w3schools.com/tags/att_global_style.asp
   */
  style? : Combo<string|ElementCSSInlineStyle>,

  // Overrides the browser's default tab order and follows the one specified instead.
  tabindex? : Combo<number>,

  // Text to be displayed in a tooltip when hovering over the element.
  title? : Combo<string>,

  // Specify whether an element’s attribute values and the values of its
  // Text node children are to be translated when the page is localized,
  // or whether to leave them unchanged.
  translate? : Combo<string>,

  // Specifies the primary language for the element's text content, in XHTML documents.
  'xml:lang'? : Combo<string>,
}

export type ElementAttributes = {
  /** @see https://www.w3schools.com/tags/tag_a.asp */
  a? : {
    download? : Combo<string>,
    href? : Combo<string>,
    hreflang? : Combo<string>,
    media? : Combo<string>,
    ping? : Combo<string>,
    referrerpolicy? : Combo<CommonAttributes['referrerpolicy']>,
    rel? : Combo<CommonAttributes['rel']>,
    shape? : Combo<string>,
    target? : Combo<CommonAttributes['target']>,
    type? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_abbr.asp */
  abbr : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_address.asp */
  address? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_applet.asp */
  applet? : {
    align? : Combo<'bottom'|'left'|'middle'|'right'|'top'|'absbottom'|'absmiddle'
    |'baseline'|'center'|'texttop'>,
    alt? : Combo<string>,
    archive? : Combo<string>,
    code? : Combo<string>,
    codebase? : Combo<string>,
    datafld? : Combo<string>,
    datasrc? : Combo<string>,
    height? : Combo<number>,
    hspace? : Combo<number>,
    mayscript? : Combo<string>,
    name? : Combo<string>,
    object? : Combo<string>,
    src? : Combo<string>,
    vspace? : Combo<number>,
    width? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_area.asp */
  area? : {
    alt? : Combo<string>,
    coords? : Combo<string>,
    download? : Combo<string>,
    href? : Combo<string>,
    hreflang? : Combo<string>,
    media? : Combo<string>,
    ping? : Combo<string>,
    referrerpolicy? : Combo<CommonAttributes['referrerpolicy']>,
    rel? : Combo<CommonAttributes['rel']>,
    shape? : Combo<'default'|'rect'|'circle'|'poly'>,
    target? : Combo<CommonAttributes['target']>,
    type? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_article.asp */
  article? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_aside.asp */
  aside? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_audio.asp */
  audio? : {
    autoplay? : Combo<boolean>,
    buffered? : Combo<string>,
    controls? : Combo<boolean>,
    crossorigin? : Combo<CommonAttributes['crossorigin']>,
    loop? : Combo<boolean>,
    muted? : Combo<boolean>,
    preload? : Combo<CommonAttributes['preload']>,
    src? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_b.asp */
  b? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_base.asp */
  base? : {
    href? : Combo<string>,
    target? : Combo<CommonAttributes['target']>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_bdi.asp */
  bdi? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_bdo.asp */
  bdo? : {
    // Required. Specifies the text direction of the text inside the <bdo> element
    dir : Combo<'ltr'|'rtl'>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_blockquote.asp */
  blockquote? : {
    cite? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_body.asp */
  body? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_br.asp */
  br? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_button.asp */
  button? : {
    autofocus? : Combo<boolean>,
    disabled? : Combo<boolean>,
    form? : Combo<string>,
    formaction? : Combo<string>,
    formenctype? : Combo<CommonAttributes['enctype']>,
    formmethod? : Combo<CommonAttributes['method']>,
    formnovalidate? : Combo<boolean>,
    formtarget? : Combo<CommonAttributes['formtarget']>,
    name? : Combo<string>,
    type? : Combo<'button'|'reset'|'submit'>,
    value? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_canvas.asp */
  canvas? : {
    height? : Combo<number>,
    width? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_caption.asp */
  caption? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_cite.asp */
  cite? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_code.asp */
  code? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_col.asp */
  col? : {
    span? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_colgroup.asp */
  colgroup? : {
    span? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_data.asp */
  data? : {
    // Specifies the machine-readable translation of the content of the element
    value? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_datalist.asp */
  datalist? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_dd.asp */
  dd? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_del.asp */
  del? : {
    cite? : Combo<string>,
    datetime? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_details.asp */
  details? : {
    open? : Combo<boolean>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_dfn.asp */
  dfn? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_dialog.asp */
  dialog? : {
    open? : Combo<boolean>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_div.asp */
  div? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_dl.asp */
  dl? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_dt.asp */
  dt? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_em.asp */
  em? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_embed.asp */
  embed? : {
    height? : Combo<number>,
    src? : Combo<string>,
    type? : Combo<string>,
    width? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_fieldset.asp */
  fieldset? : {
    disabled? : Combo<boolean>,
    form? : Combo<string>,
    name? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_figcaption.asp */
  figcaption? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_figure.asp */
  figure? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_footer.asp */
  footer? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_form.asp */
  form? : {
    'accept-charset': Combo<string>,
    action? : Combo<string>,
    autocomplete? : Combo<'on'|'off'>,
    enctype? : Combo<CommonAttributes['enctype']>,
    method? : Combo<CommonAttributes['method']>,
    name? : Combo<string>,
    novalidate? : Combo<boolean>,
    rel? : Combo<CommonAttributes['rel']>,
    target? : Combo<CommonAttributes['target']>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_hn.asp */
  h1? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_hn.asp */
  h2? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_hn.asp */
  h3? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_hn.asp */
  h4? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_hn.asp */
  h5? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_hn.asp */
  h6? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_head.asp */
  head? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_header.asp */
  header? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_hr.asp */
  hr? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_html.asp */
  html? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_i.asp */
  i? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_iframe.asp */
  iframe? : {
    allow? : Combo<string|'fullscreen'|'payment'>,
    height? : Combo<number>,
    importance? : Combo<string>,
    loading? : Combo<CommonAttributes['loading']>,
    name? : Combo<string>,
    referrerpolicy? : Combo<CommonAttributes['referrerpolicy']>,
    sandbox? : Combo<''|'allow-forms'|'allow-modals'|'allow-orientation-lock'|'allow-pointer-lock'|'allow-popups'
    |'allow-popups-to-escape-sandbox'|'allow-presentation'|'allow-same-origin'|'allow-scripts'
    |'allow-top-navigation'|'allow-top-navigation-by-user-activation'>,
    src? : Combo<string>,
    srcdoc? : Combo<string>,
    width? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_img.asp */
  img? : {
    alt : Combo<string>,
    border? : Combo<string>,
    crossorigin? : Combo<CommonAttributes['crossorigin']>,
    decoding? : Combo<'sync'|'async'|'auto'>,
    height? : Combo<boolean>,
    intrinsicsize? : Combo<string>,
    ismap? : Combo<boolean>,
    loading? : Combo<CommonAttributes['loading']>,
    referrerpolicy? : Combo<CommonAttributes['referrerpolicy']>,
    sizes? : Combo<string>,
    src : Combo<string>,
    srcset? : Combo<string>,
    usemap? : Combo<string>,
    width? : Combo<boolean>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_input.asp */
  input? : {
    /** @see https://www.w3schools.com/tags/att_input_accept.asp */
    accept? : Combo<string>,
    alt? : Combo<string>,
    autocomplete? : Combo<'on'|'off'>,
    autofocus? : Combo<boolean>,
    checked? : Combo<boolean>,
    dirname? : Combo<string>,
    disabled? : Combo<boolean>,
    form? : Combo<string>,
    formaction? : Combo<string>,
    formenctype? : Combo<CommonAttributes['enctype']>,
    formmethod? : Combo<CommonAttributes['method']>,
    formnovalidate? : Combo<boolean>,
    formtarget? : Combo<CommonAttributes['formtarget']>,
    height? : Combo<number>,
    list? : Combo<string>,
    max? : Combo<number|string>,
    maxlength? : Combo<number>,
    minlength? : Combo<number>,
    min? : Combo<number|string>,
    multiple? : Combo<boolean>,
    name? : Combo<string>,
    pattern? : Combo<string>,
    placeholder? : Combo<string>,
    readonly? : Combo<boolean>,
    required? : Combo<boolean>,
    size? : Combo<number>,
    src? : Combo<string>,
    step? : Combo<number|any>,
    type? : Combo<'button'|'checkbox'|'color'|'date'|'datetime-local'|'email'|'file'|'hidden'|'image'|'month'|'number'
    |'password'|'radio'|'range'|'reset'|'search'|'submit'|'tel'|'text'|'time'|'url'|'week'>,
    value? : Combo<string>,
    width? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_ins.asp */
  ins? : {
    cite? : Combo<string>,
    datetime? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_kbd.asp */
  kbd? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_label.asp */
  label? : {
    for? : Combo<string>,
    form? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_legend.asp */
  legend? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_li.asp */
  li? : {
    value? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_link.asp */
  link? : {
    crossorigin? : Combo<CommonAttributes['crossorigin']>,
    href? : Combo<string>,
    hreflang? : Combo<string>,
    media? : Combo<string>,
    referrerpolicy? : Combo<CommonAttributes['referrerpolicy']>,
    rel : Combo<CommonAttributes['rel']>,
    sizes? : Combo<string>,
    title? : Combo<string>,
    type? : Combo<string|'text/html'|'text/css'>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_main.asp */
  main? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_map.asp */
  map? : {
    name : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_mark.asp */
  mark? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_meta.asp */
  meta? : {
    charset? : Combo<string>,
    content? : Combo<string>,
    'http-equiv'? : Combo<'content-security-policy'|'content-type'|'default-style'|'refresh'>,
    name? : Combo<'application-name'|'author'|'description'|'generator'|'keywords'|'viewport'>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_meter.asp */
  meter? : {
    form? : Combo<string>,
    high? : Combo<number>,
    low? : Combo<number>,
    max? : Combo<number>,
    min? : Combo<number>,
    optimum? : Combo<number>,
    value : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_nav.asp */
  nav? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_noscript.asp */
  noscript? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_object.asp */
  object? : {
    data? : Combo<string>,
    form? : Combo<string>,
    height? : Combo<number>,
    name? : Combo<string>,
    type? : Combo<string>,
    typemustmatch? : Combo<boolean>,
    usemap? : Combo<string>,
    width? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_ol.asp */
  ol? : {
    reversed? : Combo<boolean>,
    start? : Combo<number>,
    type? : Combo<'1'|'a'|'A'|'i'|'I'>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_optgroup.asp */
  optgroup? : {
    disabled? : Combo<boolean>,
    label? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_option.asp */
  option? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_output.asp */
  output? : {
    // Specifies the relationship between the result of the calculation,
    // and the elements used in the calculation
    for? : Combo<string>,
    // Specifies which form the output element belongs to
    form? : Combo<string>,
    // Specifies a name for the output element
    name? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_p.asp */
  p? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_param.asp */
  param? : {
    name? : Combo<string>,
    value? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_picture.asp */
  picture? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_pre.asp */
  pre? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_progress.asp */
  progress? : {
    // Specifies how much work the task requires in total. Default value is 1
    max? : Combo<number>,
    // Specifies how much of the task has been completed
    value? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_q.asp */
  q? : {
    // Specifies the source URL of the quote
    cite? : Combo<string>,
  } | GlobalElementAttributes,

  // The HTML Ruby Fallback Parenthesis (<rp>) element is used to provide fall-back parentheses
  // for browsers that do not support display of ruby annotations using the <ruby> element.
  /** @see https://www.w3schools.com/tags/tag_rp.asp */
  rp? : GlobalElementAttributes,

  // The HTML Ruby Text (<rt>) element specifies the ruby text component of a ruby annotation,
  // which is used to provide pronunciation, translation, or transliteration information for
  // East Asian typography. The <rt> element must always be contained within a <ruby> element.
  /** @see https://www.w3schools.com/tags/tag_rt.asp */
  rt? : GlobalElementAttributes,

  // Represents small annotations that are rendered above, below, or next to base text,
  // usually used for showing the pronunciation of East Asian characters. It can also be
  // used for annotating other kinds of text, but this usage is less common.
  /** @see https://www.w3schools.com/tags/tag_ruby.asp */
  ruby? : GlobalElementAttributes,

  // Mark up text that is no longer correct
  /** @see https://www.w3schools.com/tags/tag_s.asp */
  s? : GlobalElementAttributes,

  // Define some text as sample output from a computer program in a document
  /** @see https://www.w3schools.com/tags/tag_samp.asp */
  samp? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_script.asp */
  script? : {
    async? : Combo<boolean>,
    crossorigin? : Combo<CommonAttributes['crossorigin']>,
    defer? : Combo<boolean>,
    integrity? : Combo<string>,
    nomodule? : Combo<boolean>,
    referrerpolicy? : Combo<CommonAttributes['referrerpolicy']>,
    src? : Combo<string>,
    type? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_section.asp */
  section? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_select.asp */
  select? : {
    autocomplete? : Combo<boolean>,
    autofocus? : Combo<boolean>,
    disabled? : Combo<boolean>,
    form? : Combo<string>,
    multiple? : Combo<string>,
    name? : Combo<string>,
    required? : Combo<boolean>,
    size? : Combo<boolean>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_small.asp */
  small? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_source.asp */
  source? : {
    media? : Combo<string>,
    sizes? : Combo<string>,
    src? : Combo<string>,
    srcset? : Combo<string>,
    type? : Combo<CommonAttributes['imageMimeTypes']>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_span.asp */
  span? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_strong.asp */
  strong? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_style.asp */
  style? : {
    media? : Combo<string>,
    type? : Combo<'text/css'|string>,
    nonce? : Combo<string>,
    title? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_sub.asp */
  sub? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_summary.asp */
  summary? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_sup.asp */
  sup? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_svg.asp */
  svg? : {
    // The displayed height of the rectangular viewport. (Not the height of its coordinate system.)
    height? : Combo<number|string|'auto'>,
    //
    preserveAspectRatio? : Combo<'none'
    |'xMinYMin meet'|'xMidYMin meet'|'xMaxYMin meet'|'xMinYMid meet'|'xMidYMid meet'
    |'xMaxYMid meet'|'xMinYMax meet'|'xMidYMax meet'|'xMaxYMax meet'

    |'xMinYMin slice'|'xMidYMin slice'|'xMaxYMin slice'|'xMinYMid slice'|'xMidYMid slice'
    |'xMaxYMid slice'|'xMinYMax slice'|'xMidYMax slice'|'xMaxYMax slice'
    >,
    viewBox? : Combo<string|'none'>,
    width? : Combo<number|string|'auto'>,
    x? : Combo<number|string>,
    y? : Combo<number|string>,
  }

  /** @see https://www.w3schools.com/tags/tag_table.asp */
  table? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_tbody.asp */
  tbody? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_td.asp */
  td? : {
    // Specifies the number of columns a cell should span
    colspan? : Combo<number>,
    // Specifies one or more header cells a cell is related to
    headers? : Combo<string>,
    // Sets the number of rows a cell should span
    rowspan? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_template.asp */
  template? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_textarea.asp */
  textarea? : {
    autocomplete? : Combo<'on'|'off'>,
    autofocus? : Combo<boolean>,
    cols? : Combo<number>,
    dirname? : Combo<string>,
    disabled? : Combo<boolean>,
    form? : Combo<string>,
    maxlength? : Combo<string>,
    minlength? : Combo<string>,
    name? : Combo<string>,
    placeholder? : Combo<string>,
    readonly? : Combo<boolean>,
    required? : Combo<boolean>,
    rows? : Combo<number>,
    wrap? : Combo<'hard'|'soft'>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_tfoot.asp */
  tfoot? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_th.asp */
  th? : {
    abbr? : Combo<string>,
    colspan? : Combo<number>,
    headers? : Combo<string>,
    rowspan? : Combo<number>,
    scope? : Combo<'col'|'colgroup'|'row'|'rowgroup'>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_thead.asp */
  thead? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_time.asp */
  time? : {
    datetime? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_title.asp */
  title? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_tr.asp */
  tr? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_track.asp */
  track? : {
    // Specifies that the track is to be enabled if the user's preferences do not indicate
    // that another track would be more appropriate
    default? : Combo<boolean>,
    // Specifies the kind of text track
    kind? : Combo<'captions'|'chapters'|'descriptions'|'metadata'|'subtitles'>,
    // Specifies the title of the text track
    label? : Combo<string>,
    // Required. Specifies the URL of the track file
    src : Combo<string>,
    // Specifies the language of the track text data (required if kind="subtitles")
    srclang? : Combo<string>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_u.asp */
  u? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_ul.asp */
  ul? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_var.asp */
  var? : GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_video.asp */
  video? : {
    autoplay? : Combo<boolean>,
    controls? : Combo<boolean>,
    crossorigin? : Combo<CommonAttributes['crossorigin']>,
    height? : Combo<number>,
    loop? : Combo<boolean>,
    muted? : Combo<boolean>,
    poster? : Combo<string>,
    preload? : Combo<CommonAttributes['preload']>,
    src? : Combo<string>,
    width? : Combo<number>,
  } | GlobalElementAttributes,

  /** @see https://www.w3schools.com/tags/tag_wbr.asp */
  wbr? : GlobalElementAttributes,
}
