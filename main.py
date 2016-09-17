from app import init_app


def rebuild_db():
    return


def run():
    config = dict(
        debug=True,
    )
    init_app().run(**config)


if __name__ == '__main__':
    run()
