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
 const setMenu = open => {
   menu.hidden = !open;
   toggle.setAttribute('aria-expanded', String(open));
   toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
   toggle.innerHTML = open ? closeIcon : menuIcon;
 };
 toggle.addEventListener('click', () => setMenu(menu.hidden));
 menu.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));
 document.addEventListener('keydown', e => {if(e.key === 'Escape') setMenu(false)});
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
