
import React, { useRef } from 'react';
import { FacebookIcon, InstagramIcon, IconProps } from './icons';

const socialLinks = [
    { name: 'Facebook', Icon: FacebookIcon, href: 'https://www.facebook.com/share/1Cudge3LLr/?mibextid=wwXIfr' },
    { name: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/kajfaasz_1906?igsh=NjFiejhudXpqbHNj' },
];

interface SocialLinkItemProps {
    name: string;
    Icon: React.FC<IconProps>;
    href: string;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ name, Icon, href }) => {
    const linkRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const item = linkRef.current;
        if (!item) return;

        const { left, top, width, height } = item.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const rotateX = -1 * ((y - height / 2) / (height / 2)) * 15;
        const rotateY = ((x - width / 2) / (width / 2)) * 15;

        item.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        const content = item.querySelector('.social-link-content') as HTMLElement;
        if(content) {
            content.style.setProperty('--mouse-x', `${x}px`);
            content.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    const handleMouseLeave = () => {
        const item = linkRef.current;
        if (!item) return;
        item.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)';
    };

    return (
        <div
            ref={linkRef}
            className="social-link-container group relative transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="social-link-content relative flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-white/10 overflow-hidden transition-colors duration-300 group-hover:bg-black/70"
                style={{ transform: 'translateZ(10px)' }}
            >
                <Icon 
                    className="w-6 h-6 text-yellow-500 transition-transform duration-300 group-hover:scale-110" 
                />
                
                <span className="absolute left-full ml-4 px-3 py-1.5 text-sm font-semibold text-white bg-black/60 backdrop-blur-md border border-white/20 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                    {name}
                </span>
            </a>
        </div>
    );
};


const SocialLinks: React.FC = () => {
    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
            <div className="flex flex-col items-center gap-4 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
                {socialLinks.map((link) => (
                    <SocialLinkItem key={link.name} name={link.name} Icon={link.Icon} href={link.href} />
                ))}
            </div>
        </div>
    );
};

export default SocialLinks;