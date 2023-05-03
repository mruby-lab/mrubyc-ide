FROM ruby:2.7

WORKDIR /root

RUN apt update -qq && apt install bison

ENV PATH $PATH:/bin

# mruby/c 2.0.1
RUN git clone https://github.com/mruby/mruby.git && cd mruby && git checkout 2.0.1 && make && cp /root/mruby/bin/mrbc /bin/mrbc2.0.1
# mruby/c 3.2.0
RUN cd mruby && make clean && git checkout 3.2.0 && make && cp /root/mruby/bin/mrbc /bin/mrbc3.2.0

COPY app .

# RUN bundle install

EXPOSE 4567

CMD ["ruby", "main.rb"]

