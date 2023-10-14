FROM ruby:2.7

WORKDIR /root

RUN apt update -qq 

ENV PATH $PATH:/bin

COPY app .
COPY start.sh .

RUN chmod 755 start.sh

RUN bundle install

EXPOSE 4567

CMD ["bash", "start.sh"]