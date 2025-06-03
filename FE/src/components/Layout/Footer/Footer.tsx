import { useTheme } from "../../../contexts/ThemeContext";
import { NavBarLinks } from "../../../types/NavBarLinks";
import { getLinkClass } from "../../../utils/utils";
import { Logo } from "../../Elements/Logo";
import "./Footer.scss";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import ScrollToTopButton from "../../Buttons/ScrollToTopButton/ScrollToTopButton";

// Social media icons
const socialLinks = [
  {
    href: "https://www.facebook.com/profile.php?id=100091428013477",
    icon: (
      <svg
        width="40px"
        height="40px"
        viewBox="-5.5 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>facebook</title>
        <path d="M1.188 5.594h18.438c0.625 0 1.188 0.563 1.188 1.188v18.438c0 0.625-0.563 1.188-1.188 1.188h-18.438c-0.625 0-1.188-0.563-1.188-1.188v-18.438c0-0.625 0.563-1.188 1.188-1.188zM14.781 17.281h2.875l0.125-2.75h-3v-2.031c0-0.781 0.156-1.219 1.156-1.219h1.75l0.063-2.563s-0.781-0.125-1.906-0.125c-2.75 0-3.969 1.719-3.969 3.563v2.375h-2.031v2.75h2.031v7.625h2.906v-7.625z"></path>
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/intensity_studio/",
    icon: (
      <svg
        width="40px"
        height="40px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 7.90001C11.1891 7.90001 10.3964 8.14048 9.72218 8.59099C9.04794 9.0415 8.52243 9.68184 8.21211 10.431C7.90179 11.1802 7.8206 12.0046 7.9788 12.7999C8.13699 13.5952 8.52748 14.3258 9.10088 14.8992C9.67427 15.4725 10.4048 15.863 11.2001 16.0212C11.9955 16.1794 12.8198 16.0982 13.569 15.7879C14.3182 15.4776 14.9585 14.9521 15.409 14.2779C15.8596 13.6036 16.1 12.8109 16.1 12C16.1013 11.4612 15.9962 10.9275 15.7906 10.4295C15.585 9.93142 15.2831 9.47892 14.9021 9.09794C14.5211 8.71695 14.0686 8.415 13.5706 8.20942C13.0725 8.00385 12.5388 7.8987 12 7.90001ZM12 14.67C11.4719 14.67 10.9557 14.5134 10.5166 14.22C10.0776 13.9267 9.73534 13.5097 9.53326 13.0218C9.33117 12.5339 9.2783 11.9971 9.38132 11.4791C9.48434 10.9612 9.73863 10.4854 10.112 10.112C10.4854 9.73863 10.9612 9.48434 11.4791 9.38132C11.9971 9.2783 12.5339 9.33117 13.0218 9.53326C13.5097 9.73534 13.9267 10.0776 14.22 10.5166C14.5134 10.9557 14.67 11.4719 14.67 12C14.67 12.7081 14.3887 13.3873 13.888 13.888C13.3873 14.3887 12.7081 14.67 12 14.67ZM17.23 7.73001C17.23 7.9278 17.1714 8.12114 17.0615 8.28558C16.9516 8.45003 16.7954 8.57821 16.6127 8.65389C16.43 8.72958 16.2289 8.74938 16.0349 8.7108C15.8409 8.67221 15.6628 8.57697 15.5229 8.43712C15.3831 8.29727 15.2878 8.11909 15.2492 7.92511C15.2106 7.73112 15.2304 7.53006 15.3061 7.34733C15.3818 7.16461 15.51 7.00843 15.6744 6.89855C15.8389 6.78866 16.0322 6.73001 16.23 6.73001C16.4952 6.73001 16.7496 6.83537 16.9371 7.02291C17.1247 7.21044 17.23 7.4648 17.23 7.73001ZM19.94 8.73001C19.9691 7.48684 19.5054 6.28261 18.65 5.38001C17.7522 4.5137 16.5474 4.03897 15.3 4.06001C14 4.00001 10 4.00001 8.70001 4.06001C7.45722 4.0331 6.25379 4.49652 5.35001 5.35001C4.49465 6.25261 4.03093 7.45684 4.06001 8.70001C4.00001 10 4.00001 14 4.06001 15.3C4.03093 16.5432 4.49465 17.7474 5.35001 18.65C6.25379 19.5035 7.45722 19.9669 8.70001 19.94C10.02 20.02 13.98 20.02 15.3 19.94C16.5432 19.9691 17.7474 19.5054 18.65 18.65C19.5054 17.7474 19.9691 16.5432 19.94 15.3C20 14 20 10 19.94 8.70001V8.73001ZM18.24 16.73C18.1042 17.074 17.8993 17.3863 17.6378 17.6478C17.3763 17.9093 17.064 18.1142 16.72 18.25C15.1676 18.5639 13.5806 18.6715 12 18.57C10.4228 18.6716 8.83902 18.564 7.29001 18.25C6.94608 18.1142 6.63369 17.9093 6.37223 17.6478C6.11076 17.3863 5.90579 17.074 5.77001 16.73C5.35001 15.67 5.44001 13.17 5.44001 12.01C5.44001 10.85 5.35001 8.34001 5.77001 7.29001C5.90196 6.94268 6.10547 6.62698 6.36733 6.36339C6.62919 6.09981 6.94355 5.89423 7.29001 5.76001C8.83902 5.44599 10.4228 5.33839 12 5.44001C13.5806 5.33856 15.1676 5.44616 16.72 5.76001C17.064 5.89579 17.3763 6.10076 17.6378 6.36223C17.8993 6.62369 18.1042 6.93608 18.24 7.28001C18.66 8.34001 18.56 10.84 18.56 12C18.56 13.16 18.66 15.67 18.24 16.72V16.73Z" />
      </svg>
    ),
  },
  {
    href: "https://t.me/+3eJJ4RWaU8oxYzAy",
    icon: (
      <svg
        width="40px"
        height="40px"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M37.1 13L9.4 24c-.9.3-.8 1.6.1 1.9l7 2.2 2.8 8.8c.2.7 1.1.9 1.6.4l4.1-3.8 7.8 5.7c.6.4 1.4.1 1.6-.6l5.4-23.2c.3-1.7-1.2-3-2.7-2.4zM20.9 29.8L20 35l-2-7.2L37.5 15 20.9 29.8z" />
      </svg>
    ),
  },
];

// Component for footer section with title
const FooterSection = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    {title && <h2 className="footer__title">{title}</h2>}
    {children}
  </div>
);

// Footer navigation component
const FooterNav = () => {
  const { t } = useTranslation();

  return (
    <nav>
      <h2 className="footer__title">{t("common.info")}</h2>
      <ul className="footer__nav-list">
        {Object.entries(NavBarLinks).map(([key, value]) => (
          <li className="footer__nav-item" key={key}>
            <NavLink to={value} className={getLinkClass}>
              {t(`nav.${key.toLowerCase()}`)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Social media section
const SocialMedia = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="footer__title">{t("contacts.followus")}</h2>
      <div className="footer__socials">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="footer__social-icon"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export const Footer = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <footer className={`footer ${theme}`}>
      <div className="container footer__content">
        <FooterSection>
          <Logo className="footer__logo" />
          <p>{t("contacts.working_title")}</p>
          <p>{t("contacts.working_hours")}</p>
        </FooterSection>

        <FooterNav />

        <div className="flex flex-col gap-6">
          <FooterSection title={t("contacts.title")}>
            <p>{t("contacts.address")}</p>
            <p>{t("contacts.phone")}</p>
            <p>{t("contacts.email")}</p>
          </FooterSection>

          <SocialMedia />
        </div>

        <ScrollToTopButton />
      </div>
    </footer>
  );
};
