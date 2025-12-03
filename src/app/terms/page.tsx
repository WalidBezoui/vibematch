
'use client';
import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/context/language-context';

export default function TermsPage() {
    const { t } = useLanguage();

    const brandTermsSections = t('termsPage.brand.sections', { returnObjects: true });
    const creatorTermsSections = t('termsPage.creator.sections', { returnObjects: true });

    const renderSections = (sections: any) => {
        if (!sections || typeof sections !== 'object') return null;
        return Object.keys(sections).map(key => {
            const section = sections[key];
            if (!section || typeof section !== 'object') return null;
            
            const content = [];
            if (section.p1) content.push(<p key="p1">{section.p1}</p>);
            if (section.p2) content.push(<p key="p2" className="mt-4">{section.p2}</p>);
            
            if (section.li1) {
                const listItems = [];
                for (let i = 1; section[`li${i}`]; i++) {
                    listItems.push(<li key={`li${i}`}>{section[`li${i}`]}</li>);
                }
                const listType = section.title && (section.title as string).includes("MANDATE") ? "decimal" : "disc";
                content.push(<ul key="list" className={`list-${listType} list-inside space-y-2 pl-4`}>{listItems}</ul>);
            }
            
             if (section.trigger_b) {
                const paymentItems = [];
                paymentItems.push(<li key="payment_trigger"><strong>{section.trigger_b}</strong>{section.trigger_t}</li>);
                 if(section.delay_b) paymentItems.push(<li key="payment_delay"><strong>{section.delay_b}</strong>{section.delay_t}</li>);
                 if(section.commission_b) paymentItems.push(<li key="payment_commission"><strong>{section.commission_b}</strong>{section.commission_t}</li>);

                content.push(<ul key="payment-list" className="list-none p-0 space-y-2">{paymentItems}</ul>);
            }

            return (
                <div key={key}>
                    <h2 className="text-2xl font-bold pt-6">{section.title}</h2>
                    <div className="space-y-4 mt-2">{content}</div>
                </div>
            );
        });
    }

    return (
        <div className="flex h-auto w-full flex-col">
            <AppHeader />
            <main className="px-4 md:px-10 lg:px-20 py-16 md:py-24 hero-bg">
                <div className="max-w-4xl mx-auto bg-background/80 dark:bg-background/80 backdrop-blur-xl border rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight gradient-text">
                            {t('termsPage.title')}
                        </h1>
                        <p className="mt-2 text-md text-foreground/60">{t('termsPage.lastUpdated', { date: '03/12/2025' })}</p>
                        <p className="mt-4 text-sm text-foreground/60 italic">{t('termsPage.discrepancyNotice')}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                        <h2 className="text-3xl font-bold border-b pb-4">{t('termsPage.brand.title')}</h2>
                        {renderSections(brandTermsSections)}
                        
                        <h2 className="text-3xl font-bold border-b pb-4 pt-12">{t('termsPage.creator.title')}</h2>
                        {renderSections(creatorTermsSections)}
                    </div>
                </div>
            </main>
        </div>
    );
}
