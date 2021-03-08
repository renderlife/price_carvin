import React, { Component } from 'react'
import priceData from '../../data/price.json'
import { cn } from '../../utils/bem';
import { ReactComponent as CarvinLogo } from '../../images/logo_carvin.svg';
import { Header, HeaderModule, HeaderLogo, HeaderSearchBar, HeaderMenu } from '@consta/uikit/Header';
import { SearchBarPropOnChange } from '@consta/uikit/__internal__/src/components/Header/SearchBar/HeaderSearchBar';
import styles from '../../styles/styles.module.sass';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import '../../styles/HeaderWithLogoExample.css';
import { Text } from '@consta/uikit/Text';
import { Table, TableColumn } from '@consta/uikit/Table';
import { Button } from '@consta/uikit/Button';
import { IconAdd } from '@consta/uikit/IconAdd';
import { PropsWithHTMLAttributes } from '../../utils/types/PropsWithHTMLAttributes';

const cnExample = cn('HeaderWithLogoExample');
const menuItems = [
    {
        label: 'Легковой',
        active: true,
        href: '#passenger-car',
    },
    {
        label: 'Кроссовер',
        href: '#crossover'
    },
    {
        label: 'Внедорожник',
        href: '#off-road'
    },
];

const columns: TableColumn<{
    id: string;
    category: string;
    title: string;
    priceFrom: string;
    price: string;
    time: string;
    desc: string;
    //action: JSX.Element;
  }>[] = [
    {
        title: 'Категория',
        accessor: 'category',
    },
    {
        title: 'Наименование услуги',
        accessor: 'title',
    },
    {
        title: 'Цена от',
        accessor: 'priceFrom',
    },
    {
        title: 'Цена',
        accessor: 'price',
    },
    {
        title: 'Время, ч',
        accessor: 'time',
    },
    {
        title: 'Примечание',
        accessor: 'desc',
    },
    /*{
        title: 'Действие',
        accessor: 'action',
    },*/
];

interface State {
    searchQuery: string | null
}

class Content extends Component<RouteComponentProps, State> {
    constructor(props: RouteComponentProps) {
        super(props)

        this.state = {
            searchQuery: ''
        }
    }

    handleSearchInput: SearchBarPropOnChange = ({ value }) => {
        this.setState({ searchQuery: value })
    }

    getTabs = () => {
        const hash = this.props.location.hash
        return menuItems.map(item => {
            return {
                ...item,
                active: !hash || hash === item.href
            }
        })
    }

    activeClassAutoName = () => {
        const hash = this?.props?.location?.hash
        const activeItem = menuItems.find(item => item.href === hash)

        return activeItem?.label || ''
    }

    renderAddButton = () => {
        return (
            <Button
                view="ghost"
                size="xs"
                iconLeft={IconAdd}
            />
        )
    }

    getRows = () => {
        const searchQueryLower = this.state.searchQuery ? this.state.searchQuery.toLowerCase() : null
        const rawRows = priceData
        const activeClassAutoName = this.activeClassAutoName()

        const rows = rawRows
            .filter(o => o.classAuto === activeClassAutoName || !activeClassAutoName)
            .filter(o => searchQueryLower === null || o.title.toLowerCase().includes(searchQueryLower) )
            .map((o, i) => {
                const category = o.category ? o.category : 'Без категории'
                const title = o.title ? o.title : 'Без наименования'
                const priceFrom = o.priceFrom ? o.priceFrom : '-'
                const price = o.price ? o.price : '-'
                const time = o.time ? o.time : '-'
                const desc = o.desc ? o.desc : '-'
                const index = i + 1

                return {
                    id: index.toString(),
                    category,
                    title,
                    priceFrom,
                    price,
                    time,
                    desc,
                    button: this.renderAddButton()
                }
            })

        return rows || []
    }

    render() {
        const { searchQuery } = this.state
        const tabs = this.getTabs()
        const rows = this.getRows()

        return (
            <>
                <Header
                    className={cnExample()}
                    leftSide={
                        <>
                            <HeaderModule indent="s">
                                <HeaderLogo className={styles.logo}>
                                    <CarvinLogo/>
                                </HeaderLogo>
                            </HeaderModule>
                            <HeaderModule indent="l">
                                <HeaderSearchBar
                                    placeholder="Название услуги"
                                    value={searchQuery}
                                    onChange={this.handleSearchInput}
                                />
                            </HeaderModule>
                            <HeaderModule indent="l">
                                <HeaderMenu items={tabs} />
                            </HeaderModule>
                        </>
                    }
                />
                <Table
                    columns={columns}
                    rows={rows}
                    emptyRowsPlaceholder={<Text>Данные не найдены</Text>}
                />
            </>
        )
    }
}

export default withRouter(Content)
