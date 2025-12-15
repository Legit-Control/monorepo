import type { MetaRecord } from 'nextra'
 
/**
 * type MetaRecordValue =
 *  | TitleSchema
 *  | PageItemSchema
 *  | SeparatorSchema
 *  | MenuSchema
 *
 * type MetaRecord = Record<string, MetaRecordValue>
 **/
const meta: MetaRecord = {
    docs: {
        title: 'Documentation',
        type: 'page',
        href: '/docs',
    },
    vision: {
        title: 'Vision',
        type: 'page',
        href: '/vision',
    },
    showcase: {
        title: 'Showcase',
        type: 'page',
        href: '/showcase',
    }
}
 
export default meta