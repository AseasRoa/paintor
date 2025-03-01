## The Public Directory

Sometimes you may need to provide static assets that are not directly
referenced in any of your Markdown or theme components, or you may
want to serve certain files with the original filename. Examples
of such files include robots.txt, favicons, and PWA icons.

You can place these files in the public directory under the source
directory. For example, if your project root is ./docs and using
default source directory location, then your public directory
will be ./docs/public.

Assets placed in public will be copied to the root of the output
directory as-is.

Note that you should reference files placed in public using root
absolute path - for example, public/icon.png should always be
referenced in source code as /icon.png.
