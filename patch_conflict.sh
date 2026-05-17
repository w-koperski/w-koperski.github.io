cat << 'INNER_EOF' > /tmp/conflict.patch
--- src/layouts/Base.astro
+++ src/layouts/Base.astro
@@ -63,7 +63,6 @@
     <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
     <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://personal.koperski.tech; connect-src 'self' https://personal.koperski.tech;" />
     <ViewTransitions />
-<<<<<<< HEAD

     <!-- Structured Data (JSON-LD) -->
     <script type="application/ld+json" set:html={JSON.stringify({
@@ -76,7 +75,6 @@
         "https://github.com/w-koperski"
       ]
     })} />
-=======
     <script is:inline>
       (function() {
         try {
@@ -93,7 +91,6 @@
         }
       })();
     </script>
->>>>>>> origin/main
   </head>
   <body class="bg-background text-on-background font-body-md text-body-md grid-bg min-h-screen flex flex-col antialiased">
     <a href="#main-content" class="skip-link">Skip to content</a>
INNER_EOF
git apply /tmp/conflict.patch
