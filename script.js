'use strict';
 document.documentElement.classList.add('js');
 const header = document.getElementById('site-header');
 const toggle = document.getElementById('menu-toggle');
 const menu = document.getElementById('mobile-menu');
 const updateHeader = () => {
   const scrolled = window.scrollY > 20;
   header.classList.toggle('bg-transparent', !scrolled);
   ['bg-primary/95', 'backdrop-blur-md', 'shadow-soft'].forEach(c => header.classList.toggle(c, scrolled));
 };
 updateHeader();
 window.addEventListener('scroll', updateHeader, {passive:true});
 const menuIcon = toggle.innerHTML;
 const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-6 w-6" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
 const applyMenu = open => {
   menu.hidden = !open;
   header.classList.toggle('mobile-menu-open', open);
   document.body.classList.toggle('mobile-menu-visible', open);
   [...header.parentElement.children].forEach(element => {
     if (element !== header) element.inert = open;
   });
   toggle.setAttribute('aria-expanded', String(open));
   toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
   toggle.innerHTML = open ? closeIcon : menuIcon;
   if (!open && document.activeElement && header.contains(document.activeElement)) toggle.focus();
 };
 let menuCloseTimer;
 const setMenu = open => {
   clearTimeout(menuCloseTimer);
   header.classList.remove('mobile-menu-closing');
   if (open || menu.hidden || window.matchMedia('(prefers-reduced-motion: reduce), (min-width: 1024px)').matches) {
     applyMenu(open);
     return;
   }
   header.classList.add('mobile-menu-closing');
   menuCloseTimer = setTimeout(() => {
     applyMenu(false);
     header.classList.remove('mobile-menu-closing');
   }, 200);
 };
 toggle.addEventListener('click', () => setMenu(menu.hidden));
 menu.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));
 document.addEventListener('keydown', e => {if(e.key === 'Escape') setMenu(false)});
 document.addEventListener('keydown', e => {
   if (menu.hidden || e.key !== 'Tab') return;
   const focusable = [...header.querySelectorAll('a, button')].filter(el => el.getClientRects().length);
   const first = focusable[0], last = focusable[focusable.length - 1];
   if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
   else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
 });
 window.matchMedia('(min-width: 1024px)').addEventListener('change', e => {
   if (e.matches && !menu.hidden) setMenu(false);
 });
 const mobileSocials = document.createElement('div');
 mobileSocials.className = 'mobile-menu-socials';
 document.querySelectorAll('.footer-social').forEach(link => mobileSocials.append(link.cloneNode(true)));
 menu.append(mobileSocials);
 const reveals = document.querySelectorAll('.reveal');
 if ('IntersectionObserver' in window) {
   const observer = new IntersectionObserver(entries => {
     entries.forEach(entry => {
       if(entry.isIntersecting) {entry.target.dataset.visible='true';observer.unobserve(entry.target)}
     });
   }, {threshold:0.15});
   reveals.forEach(el => observer.observe(el));
 } else reveals.forEach(el => el.dataset.visible='true');
 document.getElementById('current-year').textContent = new Date().getFullYear();

 // A tiny van follows the route represented by the desktop navigation.
 const routeNav = header.querySelector('nav > .lg\\:flex');
 const routeLinks = [...routeNav.querySelectorAll('a[href^="#"]')];
 const routeSections = routeLinks.map(link => document.querySelector(link.hash));
 const routeVan = document.createElement('span');
 routeVan.className = 'route-van';
 routeVan.setAttribute('aria-hidden', 'true');
 routeVan.innerHTML = `<svg viewBox="0 0 48 26" width="40" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M4 5a3 3 0 0 1 3-3h24c3 0 5 2 7 5l5 7v7H3V8a3 3 0 0 1 1-3Z" fill="#f8fafc" stroke="#142336" stroke-width="1.4"/>
   <path d="M7 5h7v7H7zm10 0h7v7h-7zm10 0h5c1.5 0 2.5 1.5 4 4l2 3H27Z" fill="#365b73"/>
   <path d="M4 16h38v3H4Z" fill="#33c767"/>
   <path d="M27 13v8M5 14h3m23 0h3" stroke="#142336" stroke-width="1.1"/>
   <path d="M40 14h3v3h-3" fill="#ffd56b"/>
   <circle cx="12" cy="21" r="4" fill="#142336"/><circle cx="35" cy="21" r="4" fill="#142336"/>
   <circle cx="12" cy="21" r="1.8" fill="#cbd5e1"/><circle cx="35" cy="21" r="1.8" fill="#cbd5e1"/>
 </svg>`;
 routeNav.classList.add('route-nav');
 routeNav.append(routeVan);
 let routeStops = [];
 let routeFrame = 0;
 let lastVanX = null;
 let activeRouteIndex = -1;
 const updateVan = () => {
   routeFrame = 0;
   if (!routeNav.getClientRects().length || !routeStops.length) return;
   const scroll = window.scrollY;
   let index = 0;
   while (index < routeStops.length - 1 && scroll >= routeStops[index + 1].scroll) index++;
   const start = routeStops[index];
   const end = routeStops[Math.min(index + 1, routeStops.length - 1)];
   const progress = end.scroll > start.scroll
     ? Math.max(0, Math.min(1, (scroll - start.scroll) / (end.scroll - start.scroll))) : 0;
   const x = start.x + (end.x - start.x) * progress;
   // Highlight the navigation stop closest to the van, in either direction.
   const nearestIndex = routeStops.reduce((nearest, stop, stopIndex) =>
     Math.abs(stop.x - x) < Math.abs(routeStops[nearest].x - x) ? stopIndex : nearest, 0);
   if (nearestIndex !== activeRouteIndex) {
     routeLinks.forEach((link, linkIndex) => {
       if (linkIndex === nearestIndex) link.setAttribute('aria-current', 'location');
       else link.removeAttribute('aria-current');
     });
     activeRouteIndex = nearestIndex;
   }
   if (lastVanX !== null && Math.abs(x - lastVanX) > 0.1) {
     routeVan.style.setProperty('--van-direction', x < lastVanX ? '-1' : '1');
   }
   routeVan.style.transform = `translate3d(${x}px, 0, 0)`;
   lastVanX = x;
 };
 const measureRoute = () => {
   if (!routeNav.getClientRects().length) return;
   const navBounds = routeNav.getBoundingClientRect();
   const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
   routeStops = routeLinks.map((link, index) => {
     const bounds = link.getBoundingClientRect();
     return {
       x: bounds.left - navBounds.left + bounds.width / 2 - 20,
       scroll: index === 0 ? 0 : Math.max(0, Math.min(maxScroll,
         routeSections[index].getBoundingClientRect().top + window.scrollY - header.offsetHeight - 16))
     };
   });
   lastVanX = null;
   updateVan();
 };
 window.addEventListener('scroll', () => {
   if (!routeFrame) routeFrame = requestAnimationFrame(updateVan);
 }, {passive: true});
 window.addEventListener('resize', measureRoute);
 window.addEventListener('load', measureRoute);
 if (document.fonts) document.fonts.ready.then(measureRoute);
 measureRoute();
