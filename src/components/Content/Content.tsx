import React, { Component } from 'react'
import priceData from '../../data/price.json'
import { cn } from '../../utils/bem'
import { ReactComponent as CarvinLogo } from '../../images/logo_carvin.svg'
import { Header, HeaderModule, HeaderLogo, HeaderSearchBar, HeaderMenu } from '@consta/uikit/Header'
import { SearchBarPropOnChange } from '@consta/uikit/__internal__/src/components/Header/SearchBar/HeaderSearchBar'
import styles from '../../styles/styles.module.sass'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import '../../styles/HeaderWithLogoExample.scss'
import '../../styles/TableExample.scss'
import '../../styles/SidebarExample.scss'

import { Text } from '@consta/uikit/Text'
import { Table, TableColumn } from '@consta/uikit/Table'
import { Button } from '@consta/uikit/Button'
import { Sidebar } from '@consta/uikit/Sidebar'

import { IconAdd } from '@consta/uikit/IconAdd'
import { IconRestart } from '@consta/uikit/IconRestart'
import { IconListNumbered } from '@consta/uikit/IconListNumbered'
import { IconTrash } from '@consta/uikit/IconTrash'

const cnHeaderWithLogoExample = cn('HeaderWithLogoExample');
const cnTableExample = cn('TableExample');
const cnSidebarExample = cn('SidebarExample');

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
    action: JSX.Element;
  }>[] = [
    {
        title: 'Категория',
        accessor: 'category',
    },
    {
        title: 'Наименование услуги',
        accessor: 'title',
        width: 550,
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
    {
        title: 'Действие',
        accessor: 'action',
    },
];

interface State {
    searchQuery: string | null
    cartValue: number
    isOpenCart: boolean
    cartIds: string[]
}

class Content extends Component<RouteComponentProps, State> {
    constructor(props: RouteComponentProps) {
        super(props)

        this.state = {
            searchQuery: '',
            cartValue: 0,
            isOpenCart: false,
            cartIds: []
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
                active: (!hash && item.href === '#passenger-car') || hash === item.href
            }
        })
    }

    activeClassAutoName = () => {
        const hash = this?.props?.location?.hash
        const activeItem = menuItems.find(item => item.href === hash)

        return activeItem?.label || 'Легковой'
    }

    addCart = (priceFrom: string, price: string, id: string) => {
        const { cartIds } = this.state
        const value = price ? parseInt(price) : parseInt(priceFrom)
        const newCartIds = [...cartIds, id]

        this.setState({ cartValue: this.state.cartValue + value, cartIds: newCartIds })
    }

    deleteCart = (priceFrom: string, price: string, id: string) => {
        const updateCartIds = this.state.cartIds.filter(item => item !== id)
        const value = price ? parseInt(price) : parseInt(priceFrom)

        this.setState({ cartValue: this.state.cartValue - value, cartIds: updateCartIds })
    }

    clearCart = () => {
        this.setState({ cartValue: 0, cartIds: [] })
    }

    openCart = () => {
        this.setState({ isOpenCart: !this.state.isOpenCart })
    }

    renderAddButton = (priceFrom: string | undefined, price: string | undefined, id: string) => {
        return (
            <Button
                view="ghost"
                size="s"
                iconLeft={IconAdd}
                onClick={() => this.addCart(priceFrom || '', price || '', id)}
            />
        )
    }

    renderDeleteButton = (priceFrom: string | undefined, price: string | undefined, id: string) => {
        return (
            <Button
                view="ghost"
                size="s"
                iconLeft={IconTrash}
                onClick={() => this.deleteCart(priceFrom || '', price || '', id)}
                className='redButton'
            />
        )
    }

    getPriceDataWithId = () => {
        return priceData.map((item, index) => {
            const id = (++index).toString()
            return ({
                id,
                ...item
            })
        })
    }

    getRows = () => {
        const { cartIds } = this.state
        const searchQueryLower = this.state.searchQuery ? this.state.searchQuery.toLowerCase() : null
        const rawRows = this.getPriceDataWithId()
        const activeClassAutoName = this.activeClassAutoName()

        const rows = rawRows
            .filter(o => o.classAuto === activeClassAutoName || !activeClassAutoName)
            .filter(o => {
                const titleForSearch = o.synonyms + ' ' + o.title
                return (
                    searchQueryLower === null || titleForSearch.toLowerCase().includes(searchQueryLower)
                )
            })
            .map((o, i) => {
                const category = o.category ? o.category : 'Без категории'
                const title = o.title ? o.title : 'Без наименования'
                const priceFrom = o.priceFrom ? o.priceFrom : '-'
                const price = o.price ? o.price : '-'
                const time = o.time ? o.time : '-'
                const desc = o.desc ? o.desc : '-'
                const id = o.id.toString()
                const readOnly = cartIds.includes(id) ? true : false

                return {
                    id,
                    category,
                    title,
                    priceFrom,
                    price,
                    time,
                    desc,
                    action: readOnly ? this.renderDeleteButton(o.priceFrom, o.price, id) : this.renderAddButton(o.priceFrom, o.price, id)
                }
            })

        return rows || []
    }

    getCartRows = () => {
        const { cartIds } = this.state
        const rawRows = this.getPriceDataWithId()
        console.log('rawRows :>> ', rawRows)
        const rawRowsCart = rawRows.filter(item => cartIds.includes(item.id))

        const rows = rawRowsCart
            .map(o => {
                const category = o.category ? o.category : 'Без категории'
                const title = o.title ? o.title : 'Без наименования'
                const priceFrom = o.priceFrom ? o.priceFrom : '-'
                const price = o.price ? o.price : '-'
                const time = o.time ? o.time : '-'
                const desc = o.desc ? o.desc : '-'
                const id = o.id.toString()

                return {
                    id,
                    category,
                    title,
                    priceFrom,
                    price,
                    time,
                    desc,
                    action: this.renderDeleteButton(o.priceFrom, o.price, id)
                }
            })

        return rows || []
    }

    render() {
        const { searchQuery, cartValue, isOpenCart } = this.state
        const tabs = this.getTabs()
        const rows = this.getRows()
        const rowsCart = this.getCartRows()

        return (
            <>
                <Header
                    className={cnHeaderWithLogoExample()}
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
                    rightSide={
                        <>
                            <HeaderModule indent="l">
                                <Text size="m">{`Итого: ${cartValue} ₽`}</Text>
                            </HeaderModule>
                            <HeaderModule indent="m">
                                <Button
                                    view="ghost"
                                    size="s"
                                    iconLeft={IconRestart}
                                    onClick={() => this.clearCart()}
                                    label="Очистить"
                                />
                            </HeaderModule>
                            <HeaderModule indent="m">
                                <Button
                                    size="s"
                                    view="ghost"
                                    label="Корзина"
                                    onClick={() => this.openCart()}
                                    iconLeft={IconListNumbered}
                                />
                            </HeaderModule>
                        </>
                    }
                />
                <Table
                    className={cnTableExample()}
                    columns={columns}
                    rows={rows}
                    emptyRowsPlaceholder={<Text>Данные не найдены</Text>}
                />
                <Sidebar
                    className={cnSidebarExample('Sidebar')}
                    isOpen={isOpenCart}
                    onOverlayClick={() => this.openCart()}
                    position="top"
                    height="auto"
                >
                    <Sidebar.Content className={cnSidebarExample('Content')}>
                    <Text
                        as="p"
                        size="l"
                        view="primary"
                        weight="semibold"
                        className={cnSidebarExample('Title')}
                    >
                        Выбранные услуги
                    </Text>
                    <Table
                        columns={columns}
                        rows={rowsCart}
                        emptyRowsPlaceholder={<Text>Данные не найдены</Text>}
                    />
                    </Sidebar.Content>
                    <Sidebar.Actions className={cnSidebarExample('Actions')}>
                        <Text size="m">{`Итого: ${cartValue} ₽`}</Text>
                        <Button
                            className='cartButton'
                            size="m"
                            view="ghost"
                            label="Закрыть"
                            width="default"
                            onClick={() => this.openCart()}
                        />
                    </Sidebar.Actions>
                </Sidebar>
            </>
        )
    }
}

export default withRouter(Content)
