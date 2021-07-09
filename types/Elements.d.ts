import { ElementProperties } from './ElementProperties'
import { EventHandlers } from './EventHandlers'
import { HTMLElementProperties } from './HTMLElementProperties'
import { NodeMethods } from './NodeMethods'
import { NodeProperties } from './NodeProperties'
import { ElementAttributes } from './ElementAttributes'

type Children = Array<Error|HTMLElement|HTMLElement[]|string>

type GlobalProperties =
  ElementProperties
  | HTMLElementProperties
  | NodeProperties
  | NodeMethods
  | EventHandlers
  | GlobalEventHandlers

/**
 * @see https://www.w3schools.com/tags/
 */
export interface Elements {
  /**
   * A function to create a custom HTML element
   */
  createElement(
    tagName : string,
    properties? : GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
   * @see https://www.w3schools.com/tags/tag_a.asp
   */
  a(
    properties? : ElementAttributes['a']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr
   * @see https://www.w3schools.com/tags/tag_abbr.asp
   */
  abbr(
    properties? : ElementAttributes['abbr']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address
   * @see https://www.w3schools.com/tags/tag_address.asp
   */
  address(
    properties? : ElementAttributes['address']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/applet
   * @see https://www.w3schools.com/tags/tag_applet.asp
   * @deprecated
   */
  applet(
    properties? : ElementAttributes['applet']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area
   * @see https://www.w3schools.com/tags/tag_area.asp
   */
  area(
    properties? : ElementAttributes['area']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
   * @see https://www.w3schools.com/tags/tag_article.asp
   */
  article(
    properties? : ElementAttributes['article']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
   * @see https://www.w3schools.com/tags/tag_aside.asp
   */
  aside(
    properties? : ElementAttributes['aside']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
   * @see https://www.w3schools.com/tags/tag_audio.asp
   */
  audio(
    properties? : ElementAttributes['audio']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b
   * @see https://www.w3schools.com/tags/tag_b.asp
   */
  b(
    properties? : ElementAttributes['b']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
   * @see https://www.w3schools.com/tags/tag_base.asp
   */
  base(
    properties? : ElementAttributes['base']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi
   * @see https://www.w3schools.com/tags/tag_bdi.asp
   */
  bdi(
    properties? : ElementAttributes['bdi']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo
   * @see https://www.w3schools.com/tags/tag_bdo.asp
   */
  bdo(
    properties? : ElementAttributes['bdo']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote
   * @see https://www.w3schools.com/tags/tag_blockquote.asp
   */
  blockquote(
    properties? : ElementAttributes['blockquote']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body
   * @see https://www.w3schools.com/tags/tag_body.asp
   */
  body(
    properties? : ElementAttributes['body']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br
   * @see https://www.w3schools.com/tags/tag_br.asp
   */
  br(
    properties? : ElementAttributes['br']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
   * @see https://www.w3schools.com/tags/tag_button.asp
   */
  button(
    properties? : ElementAttributes['button']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
   * @see https://www.w3schools.com/tags/tag_canvas.asp
   */
  canvas(
    properties? : ElementAttributes['canvas']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
   * @see https://www.w3schools.com/tags/tag_caption.asp
   */
  caption(
    properties? : ElementAttributes['caption']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite
   * @see https://www.w3schools.com/tags/tag_cite.asp
   */
  cite(
    properties? : ElementAttributes['cite']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code
   * @see https://www.w3schools.com/tags/tag_code.asp
   */
  code(
    properties? : ElementAttributes['code']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
   * @see https://www.w3schools.com/tags/tag_col.asp
   */
  col(
    properties? : ElementAttributes['col']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup
   * @see https://www.w3schools.com/tags/tag_colgroup.asp
   */
  colgroup(
    properties? : ElementAttributes['colgroup']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data
   * @see https://www.w3schools.com/tags/tag_data.asp
   */
  data(
    properties? : ElementAttributes['data']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist
   * @see https://www.w3schools.com/tags/tag_datalist.asp
   */
  datalist(
    properties? : ElementAttributes['datalist']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd
   * @see https://www.w3schools.com/tags/tag_dd.asp
   */
  dd(
    properties? : ElementAttributes['dd']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/del
   * @see https://www.w3schools.com/tags/tag_del.asp
   */
  del(
    properties? : ElementAttributes['del']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
   * @see https://www.w3schools.com/tags/tag_details.asp
   */
  details(
    properties? : ElementAttributes['details']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn
   * @see https://www.w3schools.com/tags/tag_dfn.asp
   */
  dfn(
    properties? : ElementAttributes['dfn']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
   * @see https://www.w3schools.com/tags/tag_dialog.asp
   */
  dialog(
    properties? : ElementAttributes['dialog']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
   * @see https://www.w3schools.com/tags/tag_div.asp
   */
  div(
    properties? : ElementAttributes['div']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
   * @see https://www.w3schools.com/tags/tag_dl.asp
   */
  dl(
    properties? : ElementAttributes['dl']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt
   * @see @see https://www.w3schools.com/tags/tag_dt.asp
   */
  dt(
    properties? : ElementAttributes['dt']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em
   * @see https://www.w3schools.com/tags/tag_em.asp
   */
  em(
    properties? : ElementAttributes['em']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed
   * @see https://www.w3schools.com/tags/tag_embed.asp
   */
  embed(
    properties? : ElementAttributes['embed']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
   * @see https://www.w3schools.com/tags/tag_fieldset.asp
   */
  fieldset(
    properties? : ElementAttributes['fieldset']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption
   * @see https://www.w3schools.com/tags/tag_figcaption.asp
   */
  figcaption(
    properties? : ElementAttributes['figcaption']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
   * @see https://www.w3schools.com/tags/tag_figure.asp
   */
  figure(
    properties? : ElementAttributes['figure']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer
   * @see https://www.w3schools.com/tags/tag_footer.asp
   */
  footer(
    properties? : ElementAttributes['footer']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
   * @see https://www.w3schools.com/tags/tag_form.asp
   */
  form(
    properties? : ElementAttributes['form']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h1
   * @see https://www.w3schools.com/tags/tag_hn.asp
   */
  h1(
    properties? : ElementAttributes['h1']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2
   * @see https://www.w3schools.com/tags/tag_hn.asp
   */
  h2(
    properties? : ElementAttributes['h2']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h3
   * @see https://www.w3schools.com/tags/tag_hn.asp
   */
  h3(
    properties? : ElementAttributes['h3']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h4
   * @see https://www.w3schools.com/tags/tag_hn.asp
   */
  h4(
    properties? : ElementAttributes['h4']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h5
   * @see https://www.w3schools.com/tags/tag_hn.asp
   */
  h5(
    properties? : ElementAttributes['h5']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h6
   * @see https://www.w3schools.com/tags/tag_hn.asp
   */
  h6(
    properties? : ElementAttributes['h6']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head
   * @see https://www.w3schools.com/tags/tag_head.asp
   */
  head(
    properties? : ElementAttributes['head']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header
   * @see https://www.w3schools.com/tags/tag_header.asp
   */
  header(
    properties? : ElementAttributes['header']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
   * @see https://www.w3schools.com/tags/tag_hr.asp
   */
  hr(
    properties? : ElementAttributes['hr']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html
   * @see https://www.w3schools.com/tags/tag_html.asp
   */
  html(
    properties? : ElementAttributes['html']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i
   * @see https://www.w3schools.com/tags/tag_i.asp
   */
  i(
    properties? : ElementAttributes['i']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
   * @see https://www.w3schools.com/tags/tag_iframe.asp
   */
  iframe(
    properties? : ElementAttributes['iframe']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
   * @see https://www.w3schools.com/tags/tag_img.asp
   */
  img(
    properties? : ElementAttributes['img']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
   * @see https://www.w3schools.com/tags/tag_input.asp
   */
  input(
    properties? : ElementAttributes['input']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ins
   * @see https://www.w3schools.com/tags/tag_ins.asp
   */
  ins(
    properties? : ElementAttributes['ins']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd
   * @see https://www.w3schools.com/tags/tag_kbd.asp
   */
  kbd(
    properties? : ElementAttributes['kbd']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
   * @see https://www.w3schools.com/tags/tag_label.asp
   */
  label(
    properties? : ElementAttributes['label']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend
   * @see https://www.w3schools.com/tags/tag_legend.asp
   */
  legend(
    properties? : ElementAttributes['legend']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
   * @see https://www.w3schools.com/tags/tag_li.asp
   */
  li(
    properties? : ElementAttributes['li']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
   * @see https://www.w3schools.com/tags/tag_link.asp
   */
  link(
    properties? : ElementAttributes['link']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main
   * @see https://www.w3schools.com/tags/tag_main.asp
   */
  main(
    properties? : ElementAttributes['main']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map
   * @see https://www.w3schools.com/tags/tag_map.asp
   */
  map(
    properties? : ElementAttributes['map']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark
   * @see https://www.w3schools.com/tags/tag_mark.asp
   */
  mark(
    properties? : ElementAttributes['mark']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
   * @see https://www.w3schools.com/tags/tag_meta.asp
   */
  meta(
    properties? : ElementAttributes['meta']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter
   * @see https://www.w3schools.com/tags/tag_meter.asp
   */
  meter(
    properties? : ElementAttributes['meter']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
   * @see https://www.w3schools.com/tags/tag_nav.asp
   */
  nav(
    properties? : ElementAttributes['nav']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript
   * @see https://www.w3schools.com/tags/tag_noscript.asp
   */
  noscript(
    properties? : ElementAttributes['noscript']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object
   * @see https://www.w3schools.com/tags/tag_object.asp
   */
  object(
    properties? : ElementAttributes['object']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
   * @see https://www.w3schools.com/tags/tag_ol.asp
   */
  ol(
    properties? : ElementAttributes['ol']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup
   * @see https://www.w3schools.com/tags/tag_optgroup.asp
   */
  optgroup(
    properties? : ElementAttributes['optgroup']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
   * @see https://www.w3schools.com/tags/tag_option.asp
   */
  option(
    properties? : ElementAttributes['option']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output
   * @see https://www.w3schools.com/tags/tag_output.asp
   */
  output(
    properties? : ElementAttributes['output']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p
   * @see https://www.w3schools.com/tags/tag_p.asp
   */
  p(
    properties? : ElementAttributes['p']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/param
   * @see https://www.w3schools.com/tags/tag_param.asp
   */
  param(
    properties? : ElementAttributes['param']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
   * @see https://www.w3schools.com/tags/tag_picture.asp
   */
  picture(
    properties? : ElementAttributes['picture']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre
   * @see https://www.w3schools.com/tags/tag_pre.asp
   */
  pre(
    properties? : ElementAttributes['pre']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress
   * @see https://www.w3schools.com/tags/tag_progress.asp
   */
  progress(
    properties? : ElementAttributes['progress']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q
   * @see https://www.w3schools.com/tags/tag_q.asp
   */
  q(
    properties? : ElementAttributes['q']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp
   * @see https://www.w3schools.com/tags/tag_rp.asp
   */
  rp(
    properties? : ElementAttributes['rp']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt
   * @see https://www.w3schools.com/tags/tag_rt.asp
   */
  rt(
    properties? : ElementAttributes['rt']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby
   * @see https://www.w3schools.com/tags/tag_ruby.asp
   */
  ruby(
    properties? : ElementAttributes['ruby']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s
   * @see https://www.w3schools.com/tags/tag_s.asp
   */
  s(
    properties? : ElementAttributes['s']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp
   * @see https://www.w3schools.com/tags/tag_samp.asp
   */
  samp(
    properties? : ElementAttributes['samp']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
   * @see https://www.w3schools.com/tags/tag_script.asp
   */
  script(
    properties? : ElementAttributes['script']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
   * @see https://www.w3schools.com/tags/tag_section.asp
   */
  section(
    properties? : ElementAttributes['section']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
   * @see https://www.w3schools.com/tags/tag_select.asp
   */
  select(
    properties? : ElementAttributes['select']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small
   * @see https://www.w3schools.com/tags/tag_small.asp
   */
  small(
    properties? : ElementAttributes['small']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
   * @see https://www.w3schools.com/tags/tag_source.asp
   */
  source(
    properties? : ElementAttributes['source']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
   * @see https://www.w3schools.com/tags/tag_span.asp
   */
  span(
    properties? : ElementAttributes['span']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong
   * @see https://www.w3schools.com/tags/tag_strong.asp
   */
  strong(
    properties? : ElementAttributes['strong']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style
   * @see https://www.w3schools.com/tags/tag_style.asp
   */
  style(
    properties? : ElementAttributes['style']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub
   * @see https://www.w3schools.com/tags/tag_sub.asp
   */
  sub(
    properties? : ElementAttributes['sub']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
   * @see https://www.w3schools.com/tags/tag_summary.asp
   */
  summary(
    properties? : ElementAttributes['summary']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup
   * @see https://www.w3schools.com/tags/tag_sup.asp
   */
  sup(
    properties? : ElementAttributes['sup']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg
   * @see https://www.w3schools.com/tags/tag_svg.asp
   */
  svg(
    properties? : ElementAttributes['svg']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
   * @see https://www.w3schools.com/tags/tag_table.asp
   */
  table(
    properties? : ElementAttributes['table']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
   * @see https://www.w3schools.com/tags/tag_tbody.asp
   */
  tbody(
    properties? : ElementAttributes['tbody']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td
   * @see https://www.w3schools.com/tags/tag_td.asp
   */
  td(
    properties? : ElementAttributes['td']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
   * @see https://www.w3schools.com/tags/tag_template.asp
   */
  template(
    properties? : ElementAttributes['template']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
   * @see https://www.w3schools.com/tags/tag_textarea.asp
   */
  textarea(
    properties? : ElementAttributes['textarea']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
   * @see https://www.w3schools.com/tags/tag_tfoot.asp
   */
  tfoot(
    properties? : ElementAttributes['tfoot']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
   * @see https://www.w3schools.com/tags/tag_th.asp
   */
  th(
    properties? : ElementAttributes['th']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
   * @see https://www.w3schools.com/tags/tag_thead.asp
   */
  thead(
    properties? : ElementAttributes['thead']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
   * @see https://www.w3schools.com/tags/tag_time.asp
   */
  time(
    properties? : ElementAttributes['time']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title
   * @see https://www.w3schools.com/tags/tag_title.asp
   */
  title(
    properties? : ElementAttributes['title']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
   * @see https://www.w3schools.com/tags/tag_tr.asp
   */
  tr(
    properties? : ElementAttributes['tr']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
   * @see https://www.w3schools.com/tags/tag_track.asp
   */
  track(
    properties? : ElementAttributes['track']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u
   * @see https://www.w3schools.com/tags/tag_u.asp
   */
  u(
    properties? : ElementAttributes['u']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
   * @see https://www.w3schools.com/tags/tag_ul.asp
   */
  ul(
    properties? : ElementAttributes['ul']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var
   * @see https://www.w3schools.com/tags/tag_var.asp
   */
  var(
    properties? : ElementAttributes['var']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
   * @see https://www.w3schools.com/tags/tag_video.asp
   */
  video(
    properties? : ElementAttributes['video']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr
   * @see https://www.w3schools.com/tags/tag_wbr.asp
   */
  wbr(
    properties? : ElementAttributes['wbr']|GlobalProperties,
    ...children : Children
  ) : HTMLElement;
}
